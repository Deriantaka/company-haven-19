import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/industrial/AppShell";
import { EntityHero } from "@/components/industrial/EntityHero";
import { ResourceCard } from "@/components/industrial/ResourceCard";
import { AddDialog } from "@/components/industrial/AddDialog";
import { Button } from "@/components/ui/button";
import { useStore, findById } from "@/lib/store";

export const Route = createFileRoute("/groups/$groupId")({
  head: () => ({ meta: [{ title: "Production Lines — VIBSENSE" }] }),
  component: Page,
});

function Page() {
  const { groupId } = Route.useParams();
  const { data, addItem, removeItem, updateItem } = useStore();
  const group = findById(data.groups, groupId);
  const factory = group ? findById(data.factories, group.parentId ?? "") : undefined;
  const company = factory ? findById(data.companies, factory.parentId ?? "") : undefined;
  const lines = data.lines.filter((l) => l.parentId === groupId);

  if (!group) return <AppShell crumbs={[{ label: "Unknown" }]}><p>Not found.</p></AppShell>;

  return (
    <AppShell
      crumbs={[
        ...(company ? [{ label: company.name, to: `/companies/${company.id}` }] : []),
        ...(factory ? [{ label: factory.name, to: `/factories/${factory.id}` }] : []),
        { label: group.name },
      ]}
    >
      <EntityHero
        title={group.name}
        icon={group.icon}
        onIconChange={(d) => updateItem("groups", group.id, { icon: d })}
        onEdit={() => {
          const n = prompt("Rename", group.name);
          if (n?.trim()) updateItem("groups", group.id, { name: n.trim() });
        }}
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-[oklch(0.3_0.07_260)]">Production Line List</h2>
        <div className="flex gap-2">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Dashboard View</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Reorder Data</Button>
          <AddDialog title="Add production line" iconOnly onAdd={(name) => addItem("lines", name, groupId)} />
        </div>
      </div>
      {lines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No production lines yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {lines.map((l) => (
            <ResourceCard
              key={l.id}
              title={l.name}
              to={`/lines/${l.id}`}
              icon={l.icon}
              onIconChange={(d) => updateItem("lines", l.id, { icon: d })}
              onEdit={() => {
                const n = prompt("Rename", l.name);
                if (n?.trim()) updateItem("lines", l.id, { name: n.trim() });
              }}
              onRemove={() => removeItem("lines", l.id)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}