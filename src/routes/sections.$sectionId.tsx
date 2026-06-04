import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/industrial/AppShell";
import { TrendChart } from "@/components/industrial/TrendChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, ChevronRight, FileText, Settings, Plus, Trash2, Settings2 } from "lucide-react";
import { useStore, findById } from "@/lib/store";
import { makeTrend, makeSensorRows, type SensorRow } from "@/lib/sensor-data";

export const Route = createFileRoute("/sections/$sectionId")({
  head: () => ({ meta: [{ title: "Sensor List — VIBSENSE" }] }),
  component: Page,
});

const ranges = ["Last Day", "Last Week", "Last Month"] as const;

function Page() {
  const { sectionId } = Route.useParams();
  const { data } = useStore();
  const section = findById(data.sections, sectionId);
  const line = section ? findById(data.lines, section.parentId ?? "") : undefined;
  const group = line ? findById(data.groups, line.parentId ?? "") : undefined;
  const factory = group ? findById(data.factories, group.parentId ?? "") : undefined;
  const company = factory ? findById(data.companies, factory.parentId ?? "") : undefined;

  const trend = useMemo(() => makeTrend(), []);
  const [rows, setRows] = useState<SensorRow[]>(() => makeSensorRows());
  const [range, setRange] = useState<(typeof ranges)[number]>("Last Day");
  const [q, setQ] = useState("");
  const [manageOpen, setManageOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSensorId, setNewSensorId] = useState("");
  const [thresholdsOpen, setThresholdsOpen] = useState(false);
  const [thresholds, setThresholds] = useState({
    batteryMin: 20,
    peakMax: 15,
    rmsMax: 12,
    tempMax: 75,
    rmsGreenMin: 1,
    rmsGreenMax: 4,
    rmsYellowMax: 12,
  });

  const addSensor = () => {
    const name = newName.trim();
    const sid = newSensorId.trim();
    if (!name || !sid) return;
    setRows((prev) => [
      ...prev,
      {
        id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
        name,
        sensorId: sid,
        temp: 40 + Math.random() * 10,
        battery: 100,
        rul: 10000 + Math.floor(Math.random() * 3000),
        timestamp: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setNewName("");
    setNewSensorId("");
  };

  const removeSensor = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));

  if (!section) return <AppShell crumbs={[{ label: "Unknown" }]}><p>Not found.</p></AppShell>;

  return (
    <AppShell
      crumbs={[
        ...(company ? [{ label: company.name, to: `/companies/${company.id}` }] : []),
        ...(factory ? [{ label: factory.name, to: `/factories/${factory.id}` }] : []),
        ...(group ? [{ label: group.name, to: `/groups/${group.id}` }] : []),
        ...(line ? [{ label: line.name, to: `/lines/${line.id}` }] : []),
        { label: section.name },
      ]}
    >
      <section className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[oklch(0.3_0.07_260)]">Trend Data for Gear Box Wire Drive 1</h2>
            <p className="text-xs text-muted-foreground">16 Nov 2025 09:00 - 17 Nov 2025 09:00</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ranges.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={r === range ? "default" : "outline"}
              onClick={() => setRange(r)}
              className={r === range ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
            >
              {r}
            </Button>
          ))}
          <div className="ml-auto rounded-lg border border-border bg-[oklch(0.98_0.01_250)] px-3 py-2 text-[11px] leading-tight">
            <p className="font-bold">THRESHOLDS</p>
            <div className="mt-1 grid grid-cols-3 gap-x-4 text-muted-foreground">
              <span>Temp Max 75</span><span>Peak Max 15</span><span>RMS Max 12</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <TrendChart data={trend} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[oklch(0.3_0.07_260)]">All Sensors</h2>
          <div className="flex items-center gap-2">
          <Dialog open={thresholdsOpen} onOpenChange={setThresholdsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Threshold settings">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Threshold Settings</DialogTitle>
                <DialogDescription>
                  Configure thresholds. Status color is driven by RMS across Vertical, Horizontal and Axial axes.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Battery Min (%)</Label>
                  <Input
                    type="number"
                    value={thresholds.batteryMin}
                    onChange={(e) => setThresholds((t) => ({ ...t, batteryMin: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Temp Max (°C)</Label>
                  <Input
                    type="number"
                    value={thresholds.tempMax}
                    onChange={(e) => setThresholds((t) => ({ ...t, tempMax: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Peak Max</Label>
                  <Input
                    type="number"
                    value={thresholds.peakMax}
                    onChange={(e) => setThresholds((t) => ({ ...t, peakMax: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>RMS Max</Label>
                  <Input
                    type="number"
                    value={thresholds.rmsMax}
                    onChange={(e) => setThresholds((t) => ({ ...t, rmsMax: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-[oklch(0.98_0.01_250)] p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">RMS Status Bands</p>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Green min</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={thresholds.rmsGreenMin}
                      onChange={(e) => setThresholds((t) => ({ ...t, rmsGreenMin: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.78_0.16_75)]" /> Yellow at</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={thresholds.rmsGreenMax}
                      onChange={(e) => setThresholds((t) => ({ ...t, rmsGreenMax: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> Red at</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={thresholds.rmsYellowMax}
                      onChange={(e) => setThresholds((t) => ({ ...t, rmsYellowMax: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Green: {thresholds.rmsGreenMin} &lt; RMS &lt; {thresholds.rmsGreenMax} · Yellow: {thresholds.rmsGreenMax} &lt; RMS &lt; {thresholds.rmsYellowMax} · Red: RMS &gt; {thresholds.rmsYellowMax}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setThresholdsOpen(false)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={manageOpen} onOpenChange={setManageOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Settings className="mr-1 h-4 w-4" /> Update Sensor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Update Sensors</DialogTitle>
                <DialogDescription>Add a new sensor or remove existing ones from this section.</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addSensor();
                }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px_auto]"
              >
                <div className="space-y-1">
                  <Label htmlFor="sensor-name">Sensor Name</Label>
                  <Input
                    id="sensor-name"
                    placeholder="e.g. Motor 3P Drive 12"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="sensor-id">Sensor ID</Label>
                  <Input
                    id="sensor-id"
                    placeholder="VBS-099"
                    value={newSensorId}
                    onChange={(e) => setNewSensorId(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    <Plus className="mr-1 h-4 w-4" /> Add
                  </Button>
                </div>
              </form>
              <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-border">
                {rows.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">No sensors yet. Add one above.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {rows.map((r) => (
                      <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.sensorId}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeSensor(r.id)}
                          title="Remove sensor"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setManageOpen(false)}>
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>
        <div className="relative mb-3 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search query" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-[oklch(0.97_0.01_250)] text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sensor Name</th>
                <th className="px-4 py-3">Sensor ID</th>
                <th className="px-4 py-3">Temp (°C)</th>
                <th className="px-4 py-3">Battery</th>
                <th className="px-4 py-3">RUL</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const rmsVals = [
                  (r as any).rmsV ?? 2 + Math.sin(i) * 0.5 + i * 0.3,
                  (r as any).rmsH ?? 1.5 + Math.cos(i) * 0.5 + i * 0.25,
                  (r as any).rmsA ?? 1.8 + Math.sin(i + 1) * 0.5 + i * 0.28,
                ] as number[];
                const colorFor = (v: number): "success" | "warning" | "danger" => {
                  if (v > thresholds.rmsYellowMax) return "danger";
                  if (v > thresholds.rmsGreenMax) return "warning";
                  if (v > thresholds.rmsGreenMin) return "success";
                  return "success";
                };
                return (
                <tr key={r.id} className={i % 2 ? "bg-[oklch(0.985_0.005_250)]" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Badge color={colorFor(rmsVals[0])}>V</Badge>
                      <Badge color={colorFor(rmsVals[1])}>H</Badge>
                      <Badge color={colorFor(rmsVals[2])}>A</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.sensorId}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[oklch(0.6_0.18_240)]" />
                      {r.temp.toFixed(2)}°C
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[oklch(0.6_0.18_240)]" />
                      {r.battery}
                    </span>
                  </td>
                  <td className="px-4 py-3">{r.rul.toLocaleString()} Days</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.timestamp}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="outline" className="h-7 w-7 rounded-full">
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                      <Link to={`/sensors/${r.id}`}>
                        <Button size="icon" variant="outline" className="h-7 w-7 rounded-full">
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

function Badge({ color, children }: { color: "success" | "info" | "warning" | "danger"; children: React.ReactNode }) {
  const bg =
    color === "success"
      ? "bg-success"
      : color === "info"
      ? "bg-[oklch(0.6_0.16_240)]"
      : color === "warning"
      ? "bg-[oklch(0.78_0.16_75)]"
      : "bg-destructive";
  return (
    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${bg}`}>
      {children}
    </span>
  );
}