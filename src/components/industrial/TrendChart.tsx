import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  CartesianGrid,
} from "recharts";
import { TrendPoint } from "@/lib/sensor-data";

export function TrendChart({ data, showLegend = false }: { data: TrendPoint[]; showLegend?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" />
        <XAxis dataKey="time" tick={{ fontSize: 11, fill: "oklch(0.5 0.03 260)" }} />
        <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0.03 260)" }} />
        <Tooltip
          contentStyle={{
            background: "oklch(1 0 0)",
            border: "1px solid oklch(0.92 0.01 250)",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
        <ReferenceLine y={75} stroke="oklch(0.65 0.25 25)" strokeDasharray="4 4" />
        <Line type="monotone" dataKey="temp" name="Temp" stroke="oklch(0.6 0.18 240)" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="peakV" name="Peak V" stroke="oklch(0.55 0.18 30)" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="peakH" name="Peak H" stroke="oklch(0.5 0.2 320)" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="rmsV" name="RMS V" stroke="oklch(0.6 0.16 180)" strokeWidth={1.5} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="rmsH" name="RMS H" stroke="oklch(0.55 0.18 80)" strokeWidth={1.5} dot={{ r: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
