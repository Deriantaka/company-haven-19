import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/industrial/AppShell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStore, findById } from "@/lib/store";
import { Search, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/sensor-list")({
  head: () => ({ meta: [{ title: "Sensor List — VIBSENSE" }] }),
  component: SensorListPage,
});

function SensorListPage() {
  const { data } = useStore();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    return data.sensors.map((sensor) => {
      const section = findById(data.sections, sensor.parentId ?? "");
      const line = section ? findById(data.lines, section.parentId ?? "") : undefined;
      const group = line ? findById(data.groups, line.parentId ?? "") : undefined;
      const factory = group ? findById(data.factories, group.parentId ?? "") : undefined;
      const company = factory ? findById(data.companies, factory.parentId ?? "") : undefined;
      const pathParts = [company?.name, factory?.name, group?.name, line?.name, section?.name].filter(
        Boolean,
      ) as string[];
      const status = ((sensor as any).status as "active" | "inactive") ?? "active";
      return { id: sensor.id, name: sensor.name, status, pathParts };
    });
  }, [data]);

  const filtered = rows.filter(
    (r) =>
      !q ||
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.pathParts.join(" / ").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell crumbs={[{ label: "Sensor List" }]}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Sensor List</h1>
            <p className="text-sm text-muted-foreground">
              All sensors currently added to the dashboard.
            </p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sensor or location"
              className="pl-8"
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No sensors found.</div>
          ) : (
            <ul className="divide-y">
              {filtered.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/sensors/$sensorId"
                      params={{ sensorId: r.id }}
                      className="font-semibold hover:underline"
                    >
                      {r.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                      {r.pathParts.length === 0 ? (
                        <span className="italic">Unassigned</span>
                      ) : (
                        r.pathParts.map((p, i) => (
                          <span key={i} className="flex items-center gap-1">
                            {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
                            <span>{p}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <Badge variant={r.status === "active" ? "default" : "secondary"}>
                    <span
                      className={
                        "mr-1.5 inline-block h-1.5 w-1.5 rounded-full " +
                        (r.status === "active" ? "bg-green-400" : "bg-gray-400")
                      }
                    />
                    {r.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}