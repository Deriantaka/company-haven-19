import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import { AppShell } from "@/components/industrial/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { makeTrend, makeSpectrum, makeHistory } from "@/lib/sensor-data";

export const Route = createFileRoute("/sensors/$sensorId")({
  head: () => ({ meta: [{ title: "Sensor Detail — VIBSENSE" }] }),
  component: Page,
});

const tiles = [
  { label: "PEAK", sub: "VERTICAL", value: "0.0914", badge: "V", color: "oklch(0.55 0.18 30)" },
  { label: "PEAK", sub: "HORIZONTAL", value: "0.0623", badge: "H", color: "oklch(0.5 0.2 320)" },
  { label: "PEAK", sub: "AXIAL", value: "0.0761", badge: "A", color: "oklch(0.78 0.16 75)" },
  { label: "RMS", sub: "VERTICAL", value: "0.0529", badge: "V", color: "oklch(0.55 0.18 30)" },
  { label: "RMS", sub: "HORIZONTAL", value: "0.0446", badge: "H", color: "oklch(0.5 0.2 320)" },
  { label: "RMS", sub: "AXIAL", value: "0.0678", badge: "A", color: "oklch(0.78 0.16 75)" },
  { label: "TEMPERATURE", sub: "", value: "35.06", badge: "°C", color: "oklch(0.6 0.18 240)" },
  { label: "RUL", sub: "", value: "12482", badge: "Days", color: "oklch(0.6 0.16 180)" },
];

function Page() {
  const trend = useMemo(() => makeTrend(), []);
  const spectrum = useMemo(() => makeSpectrum(), []);
  const history = useMemo(() => makeHistory(), []);
  const [fault, setFault] = useState<{ title: string; detail: string } | null>({
    title: "AI Fault Detection",
    detail: "Imbalance, Misalignment",
  });
  const [axes, setAxes] = useState({ vertical: true, horizontal: true, axial: true });
  const toggleAxis = (k: "vertical" | "horizontal" | "axial") =>
    setAxes((a) => ({ ...a, [k]: !a[k] }));

  return (
    <AppShell
      crumbs={[{ label: "Company List", to: "/" }, { label: "Gear Box Wire Drive 1" }]}
      headerRight={
        <Button size="sm" variant="outline" className="ml-auto rounded-md">
          <Download className="mr-1 h-4 w-4" /> Export to PDF
        </Button>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
        {tiles.map((t, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-wide text-muted-foreground">{t.label}</p>
                <p className="text-[10px] font-semibold tracking-wide text-muted-foreground">{t.sub}</p>
              </div>
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: t.color }}
              >
                {t.badge}
              </span>
            </div>
            <p className="mt-2 text-xl font-bold text-[oklch(0.3_0.07_260)]">{t.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-lg font-bold text-[oklch(0.3_0.07_260)]">Trend Data for Gear Box Wire Drive 1</h2>
          <p className="text-xs text-muted-foreground">16 Nov 2025 09:00 - 17 Nov 2025 09:00</p>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <ReferenceLine y={75} stroke="oklch(0.65 0.25 25)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="temp" stroke="oklch(0.6 0.18 240)" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="peakV" stroke="oklch(0.55 0.18 30)" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="peakH" stroke="oklch(0.5 0.2 320)" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="rmsV" stroke="oklch(0.6 0.16 180)" strokeWidth={1.5} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <aside className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm font-bold text-[oklch(0.3_0.07_260)]">PREDICTED FAULT</p>
          <p className="text-[11px] text-muted-foreground">(as per 17 Nov 2025 09:00)</p>
          {fault ? (
            <>
              <div className="mt-3 rounded-lg bg-destructive p-3 text-destructive-foreground">
                <p className="text-sm font-bold">{fault.title}</p>
                <p className="text-xs opacity-90">{fault.detail}</p>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Fault detected</p>
            </>
          ) : (
            <>
              <div className="mt-3 rounded-lg bg-[oklch(0.95_0.03_150)] p-3 text-[oklch(0.35_0.12_150)]">
                <p className="text-sm font-bold">No Active Fault</p>
                <p className="text-xs opacity-90">System operating normally</p>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">No Fault</p>
            </>
          )}
        </aside>
      </div>

      <section className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[oklch(0.3_0.07_260)]">Spectrum Chart for Gear Box Wire Drive 1</h2>
            <p className="text-xs text-muted-foreground">17 Nov 2025 09:00</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {([
              { key: "vertical", label: "Vertical", color: "oklch(0.55 0.18 30)" },
              { key: "horizontal", label: "Horizontal", color: "oklch(0.6 0.18 240)" },
              { key: "axial", label: "Axial", color: "oklch(0.5 0.2 320)" },
            ] as const).map((a) => (
              <div key={a.key} className="flex items-center gap-2">
                <Checkbox
                  id={`axis-${a.key}`}
                  checked={axes[a.key]}
                  onCheckedChange={() => toggleAxis(a.key)}
                />
                <Label htmlFor={`axis-${a.key}`} className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />
                  {a.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={spectrum}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" />
              <XAxis dataKey="freq" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              {axes.vertical && (
                <Line type="monotone" dataKey="vertical" stroke="oklch(0.55 0.18 30)" strokeWidth={1.5} dot={false} />
              )}
              {axes.horizontal && (
                <Line type="monotone" dataKey="horizontal" stroke="oklch(0.6 0.18 240)" strokeWidth={1.5} dot={false} />
              )}
              {axes.axial && (
                <Line type="monotone" dataKey="axial" stroke="oklch(0.5 0.2 320)" strokeWidth={1.5} dot={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFault(null)}
            disabled={!fault}
          >
            RESET FAULT
          </Button>
          <Button variant="outline" size="sm">SEE MORE</Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-[oklch(0.97_0.01_250)] text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">id</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Batt(V)</th>
                <th className="px-3 py-2">Temp (C)</th>
                <th className="px-3 py-2">Peak (V)</th>
                <th className="px-3 py-2">Peak (H)</th>
                <th className="px-3 py-2">Peak (A)</th>
                <th className="px-3 py-2">RMS (V)</th>
                <th className="px-3 py-2">RMS (H)</th>
                <th className="px-3 py-2">RMS (A)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={h.id} className={i % 2 ? "bg-[oklch(0.985_0.005_250)]" : ""}>
                  <td className="px-3 py-2">{h.id}</td>
                  <td className="px-3 py-2">{h.time}</td>
                  <td className="px-3 py-2">{h.batt}</td>
                  <td className="px-3 py-2">{h.temp.toFixed(2)}</td>
                  <td className="px-3 py-2">{h.peakV.toFixed(4)}</td>
                  <td className="px-3 py-2">{h.peakH.toFixed(4)}</td>
                  <td className="px-3 py-2">{h.peakA.toFixed(4)}</td>
                  <td className="px-3 py-2">{h.rmsV.toFixed(4)}</td>
                  <td className="px-3 py-2">{h.rmsH.toFixed(4)}</td>
                  <td className="px-3 py-2">{h.rmsA.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}