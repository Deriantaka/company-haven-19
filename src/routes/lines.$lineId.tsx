import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/industrial/AppShell";
import { ResourceCard } from "@/components/industrial/ResourceCard";
import { AddDialog } from "@/components/industrial/AddDialog";
import { Button } from "@/components/ui/button";
import { ImagePlus, Pencil, Download } from "lucide-react";
import { useStore, findById } from "@/lib/store";

export const Route = createFileRoute("/lines/$lineId")({
  head: () => ({ meta: [{ title: "Line Section — VIBSENSE" }] }),
  component: Page,
});

function Page() {
  const { lineId } = Route.useParams();
  const { data, addItem, removeItem, updateItem } = useStore();
  const line = findById(data.lines, lineId);
  const group = line ? findById(data.groups, line.parentId ?? "") : undefined;
  const factory = group ? findById(data.factories, group.parentId ?? "") : undefined;
  const company = factory ? findById(data.companies, factory.parentId ?? "") : undefined;
  const sections = data.sections.filter((s) => s.parentId === lineId);
  const mapRef = useRef<HTMLInputElement>(null);

  if (!line) return <AppShell crumbs={[{ label: "Unknown" }]}><p>Not found.</p></AppShell>;

  const handleMap = (f: File) => {
    const r = new FileReader();
    r.onload = () => updateItem("lines", line.id, { map: r.result as string });
    r.readAsDataURL(f);
  };

  return (
    <AppShell
      crumbs={[
        ...(company ? [{ label: company.name, to: `/companies/${company.id}` }] : []),
        ...(factory ? [{ label: factory.name, to: `/factories/${factory.id}` }] : []),
        ...(group ? [{ label: group.name, to: `/groups/${group.id}` }] : []),
        { label: line.name },
      ]}
    >
      <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Machine Overview</p>
        <div className="mt-1 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-[oklch(0.3_0.07_260)]">{line.name}</h1>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => mapRef.current?.click()}>
            Edit <Pencil className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
        <input
          ref={mapRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleMap(e.target.files[0])}
        />
        <div className="mt-5 flex min-h-[260px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-[oklch(0.98_0.005_250)]">
          {line.map ? (
            <img src={line.map} alt={`${line.name} map`} className="max-h-[420px] w-full object-contain" />
          ) : (
            <button
              type="button"
              onClick={() => mapRef.current?.click()}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ImagePlus className="h-10 w-10" />
              <span className="text-sm font-medium">Upload machine map / picture</span>
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold uppercase tracking-wide text-[oklch(0.3_0.07_260)]">Line Section</h2>
        <div className="flex gap-2">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="mr-1 h-4 w-4" /> Download Report
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Reorder Data</Button>
          <AddDialog title="Add line section" iconOnly onAdd={(name) => addItem("sections", name, lineId)} />
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No sections yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((s) => (
            <ResourceCard
              key={s.id}
              title={s.name}
              to={`/sections/${s.id}`}
              icon={s.icon}
              onIconChange={(d) => updateItem("sections", s.id, { icon: d })}
              onEdit={() => {
                const n = prompt("Rename", s.name);
                if (n?.trim()) updateItem("sections", s.id, { name: n.trim() });
              }}
              onRemove={() => removeItem("sections", s.id)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}