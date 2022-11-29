import Color from "color";

declare module Ewok {
  interface FrequencyBandInfo {
    minFreq: number;
    maxFreq: number;
  }

  type RGB = [number, number, number];
  type RGBA = [number, number, number, number];

  enum FrequencyBand {
    TLF,
    ELF,
    SLF,
    ULF,
    VLF,
    LF,
    MF,
    HF,
    VHF,
    UHF,
    SHF,
    EHF,
    THF,
    L,
    S,
    C,
    X,
    Ku,
    K,
    Ka,
    V,
    W,
    mm,
  }

  interface Signal {
    // center of the signal in pixels from the left of the canvas
    center: number;
    // amplitude of the signal in decibels
    amplitude: number;
    // width of the signal in pixels
    inBandwith: number;
    bandwidth: number;
    freq: number;
    amp: number;
    target_id: number;
    maxHold: Float32Array;
    rf?: {
      id: number;
    };
    if?: {
      id: number;
    };
  }

  interface SpectrumAnalyzerOptionsInterface {
    minDecibels?: number;
    maxDecibels?: number;
    isShowSignals?: boolean;
    refreshRate?: number;
    noiseFloor?: number;
    noiseColor?: Color;
    signals?: Array<Signal>;
    minFreq?: number;
    maxFreq?: number;
    whichUnit?: number;
  }

  interface SpectrumAnalyzerConfigItemInterface {
    freq: number | null;
    span: number | null;
  }

  interface SpectrumAnalyzerConfigInterface {
    if: SpectrumAnalyzerConfigItemInterface;
    rf: SpectrumAnalyzerConfigItemInterface;
  }

  interface SpectrumAnalyzerInterface {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    options: SpectrumAnalyzerOptionsInterface;
    config: SpectrumAnalyzerConfigInterface;
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
    signals: Array<Signal>;
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

    // Initialize the draw loop
    start(): void;
    changeCenterFreq(centerFreq: number): void;
    changeBandwidth(bandwidth: number): void;
    resize(width: number, height: number): void;
    // Creates random noise using the noiseFloor value inside a Float32Array
    createNoise(data: Float32Array): Float32Array;
    resetHoldData(): void;
    // Creates a signal inside a Float32Array
    createSignal(
      data: Float32Array,
      center: number,
      amplitude: number,
      inBandWidth: number,
      outOfBandWidth: number
    ): Float32Array;
    // Draws the spectrum analyzer
    draw(): void;
    animate(): void;
    drawGridOverlay(ctx: CanvasRenderingContext2D): void;
    // Overwrites the canvas with a black background
    clearCanvas(ctx: CanvasRenderingContext2D): void;
    hideBelowNoiseFloor(ctx: CanvasRenderingContext2D): void;
    // Draws random noise using the noiseFloor value
    drawNoise(ctx: CanvasRenderingContext2D): void;
    // Draws the signal
    drawSignal(
      ctx: CanvasRenderingContext2D,
      color: Color,
      signal: Signal
    ): void;

    drawMarker(
      maxX: number,
      maxY: number,
      ctx: CanvasRenderingContext2D,
      maxSignalFreq: number
    ): void;
    // Draws the maximum value of the signal
    drawMaxHold(ctx: CanvasRenderingContext2D, color: Color): void;

    setBand(band: FrequencyBand): void;
  }
}

export as namespace Ewok;
export = Ewok;
