import SpectrumAnalyzer from "@ewokTypes/SpectrumAnalyzer";
import Color from "color";

const handleDrawInstructorSignals = (
  self: Ewok.SpectrumAnalyzerInterface,
  color: Color,
  signal: Ewok.Signal
) => {
  // Calculate 2 Signals
  const rfDownSignal = { ...signal };
  const ifDownSignal = {
    ...signal,
    freq: signal.freq - self.downconvertOffset,
  };

  // Draw 2 Signals
  if (self.isRfMode) {
    self.drawSignal(self.ctx, color, rfDownSignal);
  } else {
    self.drawSignal(self.ctx, color, ifDownSignal);
  }
};

const handleDrawStudentSignals = (
  self: Ewok.SpectrumAnalyzerInterface,
  color: Color,
  signal: Ewok.Signal
) => {
  if (self.isRfMode) {
    // Draw only RF Signal
    const rfUpSignal = {
      ...signal,
      freq: signal.freq + self.upconvertOffset,
    };
    const rfDownSignal = {
      ...signal,
      freq: signal.freq + self.upconvertOffset,
    };
    rfDownSignal.freq += self.loopback
      ? +self.antennaOffset
      : self.targetOffset;
    rfDownSignal.amp = self.loopback || self.hpa ? rfDownSignal.amp : -1000;
    self.drawSignal(self.ctx, color, rfUpSignal);
    self.drawSignal(self.ctx, color, rfDownSignal);
  } else {
    // Draw only IF Signal
    const ifUpSignal = signal;
    const ifDownSignal = {
      ...signal,
      freq: signal.freq + self.upconvertOffset - self.downconvertOffset,
    };
    ifDownSignal.freq += self.loopback
      ? +self.antennaOffset
      : self.targetOffset;
    ifDownSignal.amp = self.loopback || self.hpa ? ifDownSignal.amp : -1000;
    self.drawSignal(self.ctx, color, ifUpSignal);
    self.drawSignal(self.ctx, color, ifDownSignal);
  }
};

/*
 * Original Signal Should be in RF Down for Instructor or IF Up for Student
 */
const handleDrawSignals = (
  self: Ewok.SpectrumAnalyzerInterface,
  signal: Ewok.Signal,
  i: number
) => {
  const color = self.isShowSignals
    ? SpectrumAnalyzer.getRandomRgb(i)
    : self.noiseColor;
  if (signal.rf) {
    // Instructor
    handleDrawInstructorSignals(self, color, signal);
  } else {
    // Student
    handleDrawStudentSignals(self, color, signal);
  }
};

const calcInBandRange = (
  freq: number,
  centerInBands: [number, number],
  decramentBases: [number, number],
  freqMultiplier: number,
  randomBelow: number,
  decramentDivisor: number,
  decramentExponent: number
): number => {
  let decrement = 0;
  if (freq < centerInBands[0] * freqMultiplier) {
    const randomLow = Math.random();
    if (randomLow < randomBelow) {
      decrement +=
        (decramentBases[0] / decramentDivisor) **
        (decramentExponent + randomLow);
    }
  } else if (freq > centerInBands[1] * freqMultiplier) {
    const randomHigh = Math.random();
    if (randomHigh < randomBelow) {
      decrement +=
        (decramentBases[1] / decramentDivisor) **
        (decramentExponent + randomHigh);
    }
  }
  return decrement;
};

/*
 * Simulate Drop Near Edge of Band
 */
const calcNearBandEdge = (
  freq: number,
  centerInBandDiff: number,
  centerInBandSum: number,
  inBandWidth: number
): number => {
  const decramentBaseLow = Math.abs(freq - centerInBandDiff) / inBandWidth;
  const decramentBaseHigh = Math.abs(freq - centerInBandSum) / inBandWidth;

  return [
    calcInBandRange(
      freq,
      [centerInBandDiff, centerInBandSum],
      [decramentBaseLow, decramentBaseHigh],
      0.5,
      0.95,
      1.5,
      6.5
    ),
    calcInBandRange(
      freq,
      [centerInBandDiff, centerInBandSum],
      [decramentBaseLow, decramentBaseHigh],
      0.75,
      0.93,
      1,
      1.5
    ),
    calcInBandRange(
      freq,
      [centerInBandDiff, centerInBandSum],
      [decramentBaseLow, decramentBaseHigh],
      0.9,
      0.9,
      1,
      2.5
    ),
  ].reduce((a, b) => a + b, 0);
};

/*
 * Zero Out Signal Far Outside of the Band
 */
const zeroOutBandSignal = (
  freq: number,
  currentAmplitude: number,
  centerInBandDiff: number,
  centerInBandSum: number,
  centerOutBandDiff: number,
  centerOutBandSum: number
) => {
  if (freq > centerOutBandSum || freq < centerOutBandDiff) {
    currentAmplitude = 0;
  } else {
    // Simulate Some Bleed outside of the band
    if (freq < centerInBandDiff) {
      currentAmplitude = 0;
      // TODO: Not sure how to handle the idea of out of Band

      // if (y > 0.8 * (amplitude + this.decibelShift)) {
      //   y = 0;
      // } else {
      //   const distanceFromCenter = Math.abs(x - centerInBandDiff);
      //   y -= (distanceFromCenter / outOfBandWidth) ** (3 + Math.random());
      // }
    } else if (freq > centerInBandSum) {
      currentAmplitude = 0;
      // TODO: Not sure how to handle the idea of out of Band

      // if (y > 0.8 * (amplitude + this.decibelShift)) {
      //   y = 0;
      // } else {
      //   const distanceFromCenter = Math.abs(x - center + outOfBandWidth);
      //   y -= (distanceFromCenter / outOfBandWidth) ** (3 + Math.random());
      // }
    }
  }
  return currentAmplitude;
};

export { handleDrawSignals, calcNearBandEdge, zeroOutBandSignal };
