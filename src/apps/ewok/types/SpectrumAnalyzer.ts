import {
  calcNearBandEdge,
  handleDrawSignals,
  zeroOutBandSignal,
} from "@ewokUtils/spectrumAnalyzer";
import Color from "color";
import { FrequencyBand } from "types/ewok";

class SpectrumAnalyzer implements Ewok.SpectrumAnalyzerInterface {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  options: Ewok.SpectrumAnalyzerOptionsInterface;
  config: Ewok.SpectrumAnalyzerConfigInterface;
  width: number;
  height: number;
  minDecibels: number;
  maxDecibels: number;
  isShowSignals: boolean;
  decibelShift: number;
  range: number;
  data: Float32Array;
  maxHoldData: Float32Array;
  noiseData: Float32Array;
  refreshRate: number;
  lastDrawTime: number;
  noiseFloor: number;
  // need to find signals type
  signals: Array<Ewok.Signal>;
  minFreq: number;
  maxFreq: number;
  bandwidth: number;
  centerFreq: number;
  noiseColor: Color;
  antenna_id: number;
  antennaOffset: number;
  targetOffset: number;
  downconvertOffset: number; // Default to C Band
  upconvertOffset: number; // Default to C Band
  target_id: number | null;
  hpa: boolean;
  loopback: boolean;
  lock: boolean;
  operational: boolean;
  isRfMode: boolean;
  isDrawMarker: boolean;
  isDrawHold: boolean;
  isPause: boolean;
  running: boolean;
  whichUnit: number;
  constructor(
    canvas: HTMLCanvasElement,
    options: Ewok.SpectrumAnalyzerOptionsInterface
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.options = options;
    this.width = canvas.width;
    this.height = canvas.height;
    this.minDecibels = options.minDecibels || -120;
    this.maxDecibels = options.maxDecibels || -20;
    this.isShowSignals = options.isShowSignals ?? false;
    this.decibelShift = 0 - this.minDecibels; // Shift to 0 as min
    this.range = this.minDecibels - this.maxDecibels;
    this.data = new Float32Array(this.width);
    this.maxHoldData = new Float32Array(this.width);
    this.noiseData = new Float32Array(this.width);
    this.refreshRate = options.refreshRate || 10;
    this.lastDrawTime = 0;
    this.noiseFloor = options.noiseFloor || 5;
    this.signals = options.signals || [];
    this.minFreq = options.minFreq || 420e6;
    this.maxFreq = options.maxFreq || 450e6;
    this.bandwidth = this.maxFreq - this.minFreq;
    this.centerFreq = this.minFreq + this.bandwidth / 2;
    this.noiseColor = options?.noiseColor || new Color({ hex: "#0bf" }, "hex");
    this.antenna_id = 1;
    this.antennaOffset = 0;
    this.targetOffset = 400e6;
    this.downconvertOffset = 3500e6; // Default to C Band
    this.upconvertOffset = 3350e6; // Default to C Band
    this.target_id = null;
    this.hpa = false;
    this.loopback = false;
    this.lock = true;
    this.operational = true;
    this.isRfMode = false;
    this.isDrawMarker = false;
    this.isDrawHold = false;
    this.isPause = false;
    this.running = false;
    this.whichUnit = options.whichUnit || 0;
    this.resize(
      this.canvas?.parentElement?.offsetWidth
        ? this.canvas.parentElement.offsetWidth - 6
        : 0,
      this.canvas?.parentElement?.offsetWidth
        ? this.canvas.parentElement.offsetWidth - 6
        : 0
    );
    this.config = {
      if: {
        freq: null, // Hz
        span: null, // Hz
      },
      rf: {
        freq: null, // Hz
        span: null, // Hz
      },
    };

    window.addEventListener("resize", () => {
      if (
        this.canvas?.parentElement?.offsetWidth !== undefined &&
        this.canvas?.parentElement?.offsetWidth - 6 !== this.canvas.width - 6
      ) {
        this.resize(
          this.canvas?.parentElement?.offsetWidth - 6,
          this.canvas?.parentElement?.offsetWidth - 6
        );
      }
    });
  }

  /**
   * This kicks off the draw loop
   */
  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    setTimeout(() => {
      this.draw();
    }, Math.random() * 1000);
  }

  changeCenterFreq(frequency: number) {
    this.centerFreq = frequency;
    this.minFreq = frequency - this.bandwidth / 2;
    this.maxFreq = frequency + this.bandwidth / 2;

    if (this.isRfMode) {
      this.config.rf.freq = frequency;
    } else {
      this.config.if.freq = frequency;
    }
  }

  changeBandwidth(frequnecySpan: number) {
    this.bandwidth = frequnecySpan;
    this.minFreq = this.centerFreq - this.bandwidth / 2;
    this.maxFreq = this.centerFreq + this.bandwidth / 2;

    if (this.isRfMode) {
      this.config.rf.span = frequnecySpan;
    } else {
      this.config.if.span = frequnecySpan;
    }
  }

  resize(width: number, height: number) {
    this.width = width > 0 ? width : 10; // Jest
    this.height = height > 0 ? height : 10; // Jest
    this.canvas.width = width > 0 ? width : 10; // Jest
    this.canvas.height = height > 0 ? height : 10; // Jest
    this.data = new Float32Array(this.width);
    this.noiseData = new Float32Array(this.width);
    this.maxHoldData = new Float32Array(this.width);
    this.signals.forEach((signal) => {
      signal.maxHold = new Float32Array(this.width);
    });
  }

  /**
   * This creates random noise using the noiseFloor value inside a Float32Array
   * @param {Float32Array} data This is a reusable Float32Array
   * @returns
   */
  createNoise(data: Float32Array) {
    for (let x = 0; x < data.length; x++) {
      data[x] =
        (0.5 + (5 * Math.random()) / 10) *
        (this.noiseFloor + this.decibelShift);
      if (Math.random() > 0.999) {
        data[x] *= 1 + Math.random();
      }

      if (this.maxHoldData[x] < data[x]) {
        this.maxHoldData[x] = data[x];
      }
    }
    return data;
  }

  resetHoldData() {
    this.maxHoldData = new Float32Array(this.width);
  }

  /**
   * This creates a signal inside a Float32Array
   * @param {Float32Array} data This is a reusable Float32Array
   * @param {number} center This is the center of the signal in pixels from the left of the canvas
   * @param {number} amplitude This is the amplitude of the signal in decibels
   * @param {number} inBandWidth This is the width of the signal in pixels
   * @returns
   */
  createSignal(
    data: Float32Array,
    center: number,
    amplitude: number,
    inBandWidth: number,
    outOfBandWidth: number
  ) {
    // NOTE: This could be used to create amplitude modulation
    // const isSkipTimeslot = Math.random() > 0.95;
    // if (isSkipTimeslot) {
    //   data = new Float32Array(data.length);
    //   return data;
    // }

    for (let x = 0; x < data.length; x++) {
      let y = 0;
      const centerInBandDiff = center - inBandWidth;
      const centerInBandSum = center + inBandWidth;
      const centerOutBandDiff = center - outOfBandWidth;
      const centerOutBandSum = center + outOfBandWidth;
      if (x > centerOutBandDiff || x < centerOutBandSum) {
        y = (0.75 + Math.random() / 4) * (amplitude + this.decibelShift);
        //y = (0.9 + Math.random() / 10) * (amplitude + this.decibelShift);
      }

      // Simulate Drop Near Edge of Band
      y -= calcNearBandEdge(x, centerInBandDiff, centerInBandSum, inBandWidth);

      // Zero Out Signal Far Outside of the Band
      y = zeroOutBandSignal(
        x,
        y,
        centerInBandDiff,
        centerInBandSum,
        centerOutBandDiff,
        centerOutBandSum
      );

      // Raise Hold Floor
      if (this.maxHoldData[x] < y) {
        this.maxHoldData[x] = y;
      }

      // Raise Noise Floor
      if (this.noiseData[x] < y) {
        this.noiseData[x] = y;
      }

      if (y > 0) {
        data[x] = y;
      } else {
        data[x] = 0;
      }
    }
    return data;
  }

  /**
   * This draws the spectrum analyzer
   */
  draw() {
    requestAnimationFrame(() => this.animate());
  }

  animate() {
    if (!this.isPause) {
      const now = Date.now();
      if (now - this.lastDrawTime > 1000 / this.refreshRate) {
        this.clearCanvas(this.ctx);
        this.ctx.globalAlpha = 1.0;
        this.noiseData = this.createNoise(this.noiseData);
        this.drawNoise(this.ctx);
        this.signals
          .filter((signal: Ewok.Signal) => {
            return signal.target_id === this.target_id;
          })
          .forEach((signal, i) => {
            // Original Signal Should be in RF Down for Instructor or IF Up for Student
            handleDrawSignals(this, signal, i);
          });

        if (this.isDrawHold) {
          this.drawMaxHold(this.ctx);
        }

        this.hideBelowNoiseFloor(this.ctx);
        this.drawGridOverlay(this.ctx);
        this.lastDrawTime = now;
      }
    }
    this.draw();
  }

  drawGridOverlay(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "white";
    for (let x = 0; x < this.width; x += this.width / 10) {
      ctx.fillRect(x, 0, 1, this.height);
    }
    for (let y = 0; y < this.height; y += this.height / 10) {
      ctx.fillRect(0, y, this.width, 1);
    }
    ctx.globalAlpha = 1.0;
  }

  /**
   * Overwrites the canvas with a black background
   * @param {CanvasRenderingContext2D} ctx SpecA Context
   */
  clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.width, this.height);
  }

  hideBelowNoiseFloor(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.moveTo(0, this.height);

    for (let x = 0; x < this.width; x++) {
      const y =
        (this.noiseData[x] - this.maxDecibels - this.decibelShift) / this.range;
      ctx.lineTo(x, this.height * y);
    }
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * This draws random noise using the noiseFloor value
   * @param {CanvasRenderingContext2D} ctx SpecA Context
   */
  drawNoise(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.noiseColor.hex();
    ctx.beginPath();
    for (let x = 0, len = this.noiseData.length; x < len; x++) {
      const y =
        (this.noiseData[x] - this.maxDecibels - this.decibelShift) / this.range;
      if (x === 0) {
        ctx.moveTo(x, this.height * y);
      } else {
        ctx.lineTo(x, this.height * y);
      }
    }
    ctx.stroke();
  }

  /**
   * This draws the signal
   * @param {CanvasRenderingContext2D} ctx SpecA Context
   * @param {String} color String value of color in Hex
   * @param {Signal} signal Object containing signal properties
   */
  drawSignal(ctx: CanvasRenderingContext2D, color: Color, signal: Ewok.Signal) {
    const center =
      ((signal.freq - this.minFreq) / (this.maxFreq - this.minFreq)) *
      this.width;
    const inBandWidth =
      ((signal.bandwidth / (this.maxFreq - this.minFreq)) * this.width) / 2;
    const outOfBandWidth =
      ((signal.bandwidth / (this.maxFreq - this.minFreq)) * this.width) / 1.8;

    this.data = this.createSignal(
      this.data,
      center,
      signal.amp,
      inBandWidth,
      outOfBandWidth
    );

    let maxX = 0;
    let maxY = 1;
    let maxSignalFreq = 0;

    ctx.strokeStyle = color.hex();
    ctx.beginPath();
    const len = this.data.length;
    for (let x = 0; x < len; x++) {
      const lowestSignal = this.data[x] >= this.noiseData[x] ? this.data[x] : 0;
      const y =
        (lowestSignal - this.maxDecibels - this.decibelShift) / this.range;
      maxSignalFreq = y < maxY ? lowestSignal : maxSignalFreq;
      maxX = y < maxY ? x : maxX;
      maxY = y < maxY ? y : maxY;

      if (x === 0) {
        ctx.moveTo(x, this.height * y);
      } else {
        ctx.lineTo(x, this.height * y);
      }
    }
    ctx.stroke();

    // Draw Diamond Marker
    if (this.isDrawMarker) {
      this.drawMarker(maxX, maxY, ctx, maxSignalFreq);
    }
  }

  drawMarker(
    maxX: number,
    maxY: number,
    ctx: CanvasRenderingContext2D,
    maxSignalFreq: number
  ) {
    if (maxX > 0) {
      maxY -= 0.025;
      ctx.beginPath();
      ctx.fillStyle = "#f00";
      ctx.moveTo(maxX, this.height * maxY);
      ctx.lineTo(maxX - 5, this.height * maxY - 5);
      ctx.lineTo(maxX, this.height * maxY - 10);
      ctx.lineTo(maxX + 5, this.height * maxY - 5);
      ctx.lineTo(maxX, this.height * maxY);
      ctx.fill();

      // Write Frequency Label
      ctx.fillStyle = "#fff";
      ctx.font = "10px Arial";
      ctx.fillText(
        `${(
          (this.minFreq + (maxX * (this.maxFreq - this.minFreq)) / this.width) /
          1e6
        ).toFixed(1)} Mhz`,
        maxX - 20,
        this.height * maxY - 30
      );
      ctx.fillText(
        `${(maxSignalFreq + this.minDecibels).toFixed(1)} dB`,
        maxX - 20,
        this.height * maxY - 20
      );
    }
  }

  /**
   * This draws the maximum value of the signal
   * @param {CanvasRenderingContext2D} ctx SpecA Context
   * @param {string} color String value of color in Hex
   * @param {*} signal Object containing signal properties
   */
  drawMaxHold(
    ctx: CanvasRenderingContext2D,
    color: Color = new Color({ hex: "#ff0" }, "hex")
  ) {
    ctx.strokeStyle = color.hex();
    ctx.beginPath();
    const len = this.data.length;
    for (let x = 0; x < len; x++) {
      const y =
        (this.maxHoldData[x] - this.maxDecibels - this.decibelShift) /
        this.range;
      if (x === 0) {
        ctx.moveTo(x, this.height * y);
      } else {
        ctx.lineTo(x, this.height * y);
      }
    }
    ctx.stroke();
  }

  setBand(band: Ewok.FrequencyBand): void {
    const getFrequencyBandInfo = SpectrumAnalyzer.getFrequencyBandInfo(band);
    this.minFreq = getFrequencyBandInfo.minFreq;
    this.maxFreq = getFrequencyBandInfo.maxFreq;
  }

  static getFrequencyBandInfo(
    band: Ewok.FrequencyBand
  ): Ewok.FrequencyBandInfo {
    switch (band) {
      case FrequencyBand.TLF:
        return {
          minFreq: 0,
          maxFreq: 3,
        };
      case FrequencyBand.ELF:
        return {
          minFreq: 3,
          maxFreq: 30,
        };
      case FrequencyBand.SLF:
        return {
          minFreq: 30,
          maxFreq: 300,
        };
      case FrequencyBand.ULF:
        return {
          minFreq: 300,
          maxFreq: 3e3,
        };
      case FrequencyBand.VLF:
        return {
          minFreq: 3e3,
          maxFreq: 3e4,
        };
      case FrequencyBand.LF:
        return {
          minFreq: 3e4,
          maxFreq: 3e5,
        };
      case FrequencyBand.MF:
        return {
          minFreq: 3e5,
          maxFreq: 3e6,
        };
      case FrequencyBand.HF:
        return {
          minFreq: 3e6,
          maxFreq: 3e7,
        };
      case FrequencyBand.VHF:
        return {
          minFreq: 3e7,
          maxFreq: 3e8,
        };
      case FrequencyBand.UHF:
        return {
          minFreq: 3e8,
          maxFreq: 3e9,
        };
      case FrequencyBand.SHF:
        return {
          minFreq: 3e9,
          maxFreq: 3e10,
        };
      case FrequencyBand.EHF:
        return {
          minFreq: 3e10,
          maxFreq: 3e11,
        };
      case FrequencyBand.THF:
        return {
          minFreq: 3e11,
          maxFreq: 3e12,
        };
      case FrequencyBand.L:
        return {
          minFreq: 1e9,
          maxFreq: 2e9,
        };
      case FrequencyBand.S:
        return {
          minFreq: 2e9,
          maxFreq: 4e9,
        };
      case FrequencyBand.C:
        return {
          minFreq: 4e9,
          maxFreq: 8e9,
        };
      case FrequencyBand.X:
        return {
          minFreq: 8e9,
          maxFreq: 12e9,
        };
      case FrequencyBand.Ku:
        return {
          minFreq: 12e9,
          maxFreq: 18e9,
        };
      case FrequencyBand.K:
        return {
          minFreq: 18e9,
          maxFreq: 27e9,
        };
      case FrequencyBand.Ka:
        return {
          minFreq: 27e9,
          maxFreq: 40e9,
        };
      case FrequencyBand.V:
        return {
          minFreq: 40e9,
          maxFreq: 75e9,
        };
      case FrequencyBand.W:
        return {
          minFreq: 75e9,
          maxFreq: 110e9,
        };
      case FrequencyBand.mm:
        return {
          minFreq: 110e9,
          maxFreq: 300e9,
        };
      default:
        throw new Error(
          `getFrequencyBandInfo: \nExpected: FrequencyBand\nReceived: ${JSON.stringify(
            band
          )}`
        );
    }
  }

  static getRandomRgb(i: number): Color {
    if (i % 3 === 0) {
      return new Color({ r: 255, g: (i * 32) % 255, b: (i * 64) % 255 }, "rgb");
    }
    if (i % 3 === 1) {
      return new Color({ r: (i * 64) % 255, g: (i * 32) % 255, b: 255 }, "rgb");
    }
    if (i % 3 === 2) {
      return new Color({ r: (i * 32) % 255, g: 255, b: (i * 64) % 255 }, "rgb");
    } else {
      return new Color({ r: 255, g: 255, b: 255 }, "rgb");
    }
  }
}

export default SpectrumAnalyzer;
