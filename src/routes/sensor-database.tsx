import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/industrial/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStore, findById } from "@/lib/store";
import { toast } from "sonner";
import { Plus, Search, Loader2, RefreshCw } from "lucide-react";

type DbSensor = {
  id: string;
  name: string;
  model: string;
  serial: string;
  status: "active" | "inactive";
};

const BASE_URL = "https://2891-110-139-27-138.ngrok-free.app";
const LOGIN_USER = "bagus";
const LOGIN_PASS = "Admin1234!";
const PROJECT_ID = 280;

const apiHeaders = (token?: string): HeadersInit => ({
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

async function fetchSensorsFromTheta(): Promise<DbSensor[]> {
  // Step 1: login
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify({ username: LOGIN_USER, password: LOGIN_PASS }),
  });
  if (!loginRes.ok) throw new Error(`Login failed (${loginRes.status})`);
  const loginJson = await loginRes.json();
  const token: string =
    loginJson?.token ?? loginJson?.access_token ?? loginJson?.data?.token;
  if (!token) throw new Error("Login response missing token");

  // Step 2: switch project
  const switchRes = await fetch(`${BASE_URL}/theta/project/${PROJECT_ID}`, {
    method: "PUT",
    headers: apiHeaders(token),
  });
  if (!switchRes.ok) throw new Error(`Switch project failed (${switchRes.status})`);

  // Step 3: get devices
  const devRes = await fetch(`${BASE_URL}/theta/getdevice`, {
    method: "GET",
    headers: apiHeaders(token),
  });
  if (!devRes.ok) throw new Error(`Get devices failed (${devRes.status})`);
  const devJson = await devRes.json();
  const list: any[] = Array.isArray(devJson)
    ? devJson
    : devJson?.data ?? devJson?.devices ?? [];

  return list.map((d: any, i: number) => {
    const id = String(d?.id ?? d?._id ?? d?.uuid ?? `dev-${i}`);
    const name = d?.name ?? `Sensor ${i + 1}`;
    const model = d?.type?.name ?? d?.model ?? "Unknown";
    const serial = d?.type?.code ?? d?.serial ?? id;
    const transport = (d?.transport ?? "").toString().toUpperCase();
    const status: "active" | "inactive" = transport === "MQTT" ? "active" : "inactive";
    return { id, name, model, serial, status };
  });
}

export const Route = createFileRoute("/sensor-database")({
  head: () => ({ meta: [{ title: "Sensor Database — VIBSENSE" }] }),
  component: SensorDatabasePage,
});

function SensorDatabasePage() {
  const { data, addItem } = useStore();
  const [db, setDb] = useState<DbSensor[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const rows = await fetchSensorsFromTheta();
      setDb(rows);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load sensors");
      toast.error(e?.message ?? "Failed to load sensors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Default add target: prefer the seeded vibsense section, otherwise the first available.
  const defaultSection = useMemo(() => {
    const vib = data.sections.find((s) => s.id === "sec-vibsense");
    const section = vib ?? data.sections[0];
    if (!section) return null;
    const line = findById(data.lines, section.parentId ?? "");
    const group = line ? findById(data.groups, line.parentId ?? "") : undefined;
    const factory = group ? findById(data.factories, group.parentId ?? "") : undefined;
    const company = factory ? findById(data.companies, factory.parentId ?? "") : undefined;
    const label = [company?.name, factory?.name, group?.name, line?.name, section.name]
      .filter(Boolean)
      .join(" / ");
    return { id: section.id, label };
  }, [data]);

  const addToDashboard = (sensor: DbSensor) => {
    if (!defaultSection) {
      toast.error("No section available. Create one in Company List first.");
      return;
    }
    // Generate fallback dummy metrics if API didn't supply them.
    const extra = {
      status: sensor.status,
      model: sensor.model,
      serial: sensor.serial,
      temp: Math.round(35 + Math.random() * 20),
      battery: Math.round(60 + Math.random() * 40),
      rul: Math.round(40 + Math.random() * 60),
      timestamp: new Date().toISOString(),
    } as any;
    addItem("sensors", sensor.name, defaultSection.id, extra);
    toast.success(`${sensor.name} added to ${defaultSection.label}`);
  };

  // (kept for future: list all section paths)
  void useMemo(() => {
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

  return (
    <AppShell crumbs={[{ label: "Sensor List Database" }]}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Sensor List Database</h1>
            <p className="text-sm text-muted-foreground">
              Sensors fetched from Theta. Add them to the dashboard sensor list.
              {defaultSection && (
                <span className="ml-1 text-blue-600">Target: {defaultSection.label}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, model, serial"
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
          </div>
        </div>

        {err && (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {err}
          </div>
        )}

        <div className="rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Sensor Name</th>
                <th className="px-4 py-2 font-medium">Model</th>
                <th className="px-4 py-2 font-medium">Serial</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && db.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Fetching sensors…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No sensors found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold text-blue-700">{s.name}</td>
                    <td className="px-4 py-3">{s.model}</td>
                    <td className="px-4 py-3 font-mono text-xs">{s.serial}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={s.status === "active" ? "default" : "secondary"}
                        className={
                          s.status === "active"
                            ? "bg-green-500/15 text-green-700 hover:bg-green-500/15"
                            : ""
                        }
                      >
                        <span
                          className={
                            "mr-1.5 inline-block h-1.5 w-1.5 rounded-full " +
                            (s.status === "active" ? "bg-green-500" : "bg-gray-400")
                          }
                        />
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        onClick={() => addToDashboard(s)}
                        className="bg-yellow-400 text-black hover:bg-yellow-500"
                      >
                        <Plus className="h-4 w-4" /> Add to Dashboard
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}