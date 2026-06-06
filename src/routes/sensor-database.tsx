import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/industrial/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore, findById } from "@/lib/store";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";

type DbSensor = {
  id: string;
  name: string;
  model: string;
  serial: string;
  status: "active" | "inactive";
};

const INITIAL_DB: DbSensor[] = [
  { id: "db-1", name: "VibSense Pro 3000", model: "VBS-PRO-3000", serial: "VBS-101", status: "active" },
  { id: "db-2", name: "VibSense Lite", model: "VBS-LITE", serial: "VBS-102", status: "active" },
  { id: "db-3", name: "ThermoVib X1", model: "TVX-1", serial: "TVX-201", status: "inactive" },
  { id: "db-4", name: "MotionTrack 500", model: "MT-500", serial: "MT-501", status: "active" },
  { id: "db-5", name: "VibSense Industrial", model: "VBS-IND", serial: "VBS-103", status: "active" },
  { id: "db-6", name: "AxisGuard 7", model: "AG-7", serial: "AG-701", status: "inactive" },
];

export const Route = createFileRoute("/sensor-database")({
  head: () => ({ meta: [{ title: "Sensor Database — VIBSENSE" }] }),
  component: SensorDatabasePage,
});

function SensorDatabasePage() {
  const { data, addItem } = useStore();
  const [db] = useState<DbSensor[]>(INITIAL_DB);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<DbSensor | null>(null);
  const [sectionId, setSectionId] = useState<string>("");

  const filtered = useMemo(
    () =>
      db.filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          s.serial.toLowerCase().includes(q.toLowerCase()) ||
          s.model.toLowerCase().includes(q.toLowerCase()),
      ),
    [db, q],
  );

  const sectionOptions = useMemo(() => {
    return data.sections.map((section) => {
      const line = findById(data.lines, section.parentId ?? "");
      const group = line ? findById(data.groups, line.parentId ?? "") : undefined;
      const factory = group ? findById(data.factories, group.parentId ?? "") : undefined;
      const company = factory ? findById(data.companies, factory.parentId ?? "") : undefined;
      const label = [company?.name, factory?.name, group?.name, line?.name, section.name]
        .filter(Boolean)
        .join(" / ");
      return { id: section.id, label };
    });
  }, [data]);

  const openAdd = (s: DbSensor) => {
    setSelected(s);
    setSectionId(sectionOptions[0]?.id ?? "");
  };

  const confirmAdd = () => {
    if (!selected || !sectionId) return;
    addItem("sensors", selected.name, sectionId, { status: selected.status } as any);
    toast.success(`${selected.name} added to dashboard`);
    setSelected(null);
  };

  return (
    <AppShell crumbs={[{ label: "Sensor List Database" }]}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Sensor List Database</h1>
            <p className="text-sm text-muted-foreground">
              Sensors available from the database. Add them to a location in the dashboard.
            </p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, model, serial"
              className="pl-8"
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <ul className="divide-y">
            {filtered.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{s.name}</span>
                    <Badge variant={s.status === "active" ? "default" : "secondary"}>
                      {s.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {s.model} · Serial {s.serial}
                  </div>
                </div>
                <Button size="sm" onClick={() => openAdd(s)}>
                  <Plus className="h-4 w-4" /> Add to Dashboard
                </Button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="p-8 text-center text-sm text-muted-foreground">No sensors found.</li>
            )}
          </ul>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {selected?.name} to dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Choose location</Label>
            <Select value={sectionId} onValueChange={setSectionId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {sectionOptions.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {sectionOptions.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No sections available. Create one from the Company List first.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button onClick={confirmAdd} disabled={!sectionId}>
              Add Sensor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}