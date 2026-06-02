export type TrendPoint = {
  time: string;
  temp: number;
  peakV: number;
  peakH: number;
  peakA: number;
  rmsV: number;
  rmsH: number;
  rmsA: number;
};

export function makeTrend(points = 28): TrendPoint[] {
  const out: TrendPoint[] = [];
  const start = new Date();
  start.setHours(9, 0, 0, 0);
  start.setDate(start.getDate() - 1);
  for (let i = 0; i < points; i++) {
    const d = new Date(start.getTime() + i * 60 * 60 * 1000);
    const wobble = Math.sin(i / 3) * 0.5;
    out.push({
      time: `${String(d.getHours()).padStart(2, "0")}:00`,
      temp: 35 + Math.sin(i / 4) * 1.5 + (i > 22 ? -3 : 0),
      peakV: 0.09 + wobble * 0.02 + Math.random() * 0.01,
      peakH: 0.06 + wobble * 0.015 + Math.random() * 0.01,
      peakA: 0.075 + wobble * 0.018 + Math.random() * 0.01,
      rmsV: 0.053 + Math.random() * 0.008,
      rmsH: 0.045 + Math.random() * 0.008,
      rmsA: 0.068 + Math.random() * 0.008,
    });
  }
  return out;
}

export type SpectrumPoint = { freq: number; vertical: number; horizontal: number; axial: number };

export function makeSpectrum(): SpectrumPoint[] {
  const out: SpectrumPoint[] = [];
  for (let f = 0; f <= 1000; f += 10) {
    const decay = Math.exp(-f / 120);
    out.push({
      freq: f,
      vertical: 0.05 * decay + Math.random() * 0.002,
      horizontal: 0.045 * decay + Math.random() * 0.002,
      axial: 0.04 * decay + Math.random() * 0.002,
    });
  }
  return out;
}

export type SensorRow = {
  id: string;
  name: string;
  sensorId: string;
  temp: number;
  battery: number;
  rul: number;
  timestamp: string;
};

export function makeSensorRows(): SensorRow[] {
  return [
    { id: "1", name: "Gear Box Wire Drive 1", sensorId: "VBS-007", temp: 46.63, battery: 100, rul: 12482, timestamp: "24 Sep 2025, 05:00" },
    { id: "2", name: "Roll 1P Back Side 20", sensorId: "VBS-026", temp: 56.07, battery: 100, rul: 12161, timestamp: "14 Jan 2026, 17:00" },
    { id: "3", name: "Motor 1P Suction 17", sensorId: "VBS-051", temp: 57.25, battery: 100, rul: 11975, timestamp: "10 Jan 2026, 13:00" },
    { id: "4", name: "Roll 1P Front Side 19", sensorId: "VBS-024", temp: 37.19, battery: 100, rul: 11184, timestamp: "02 Feb 2026, 04:00" },
    { id: "5", name: "Motor 2P Drive 9", sensorId: "VBS-009", temp: 42.4, battery: 96, rul: 10520, timestamp: "11 Mar 2026, 09:00" },
    { id: "6", name: "Gearbox 2P Output", sensorId: "VBS-015", temp: 49.8, battery: 88, rul: 9870, timestamp: "02 Apr 2026, 11:00" },
  ];
}

export type HistoryRow = {
  id: number;
  time: string;
  batt: number;
  temp: number;
  peakV: number;
  peakH: number;
  peakA: number;
  rmsV: number;
  rmsH: number;
  rmsA: number;
};

export function makeHistory(n = 30): HistoryRow[] {
  const out: HistoryRow[] = [];
  let id = 2712159;
  for (let i = 0; i < n; i++) {
    const hour = 9 - Math.floor(i / 3);
    const stamp = `17 Nov 2025 ${String(((hour + 24) % 24)).padStart(2, "0")}:00`;
    const spiked = i % 9 === 7;
    out.push({
      id: id--,
      time: stamp,
      batt: 100,
      temp: spiked ? 39.19 : 35.06 + (i % 5) * 0.4,
      peakV: spiked ? 4.0604 : 0.0914 + (i % 4) * 0.001,
      peakH: spiked ? 7.6505 : 0.0623 + (i % 4) * 0.001,
      peakA: spiked ? 4.1904 : 0.0761 + (i % 4) * 0.001,
      rmsV: spiked ? 1.8324 : 0.0529 + (i % 4) * 0.001,
      rmsH: spiked ? 3.366 : 0.0446 + (i % 4) * 0.001,
      rmsA: spiked ? 1.9118 : 0.0678 + (i % 4) * 0.001,
    });
  }
  return out;
}