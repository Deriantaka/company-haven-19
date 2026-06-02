import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/industrial/AppShell";
import { EntityHero } from "@/components/industrial/EntityHero";
import { ResourceCard } from "@/components/industrial/ResourceCard";
import { AddDialog } from "@/components/industrial/AddDialog";
import { useStore, findById } from "@/lib/store";

export const Route = createFileRoute("/factories/$factoryId")({
  head: () => ({ meta: [{ title: "Machine Groups — VIBSENSE" }] }),
  component: Page,
});

function Page() {
  const { factoryId } = Route.useParams();
  const { data, addItem, removeItem, updateItem } = useStore();
  const factory = findById(data.factories, factoryId);
  const company = factory ? findById(data.companies, factory.parentId ?? "") : undefined;
  const groups = data.groups.filter((g) => g.parentId === factoryId);

  if (!factory) return <AppShell crumbs={[{ label: "Unknown" }]}><p>Not found.</p></AppShell>;

  return (
    <AppShell
      crumbs={[
        ...(company ? [{ label: company.name, to: `/companies/${company.id}` }] : []),
        { label: factory.name },
      ]}
    >
      <EntityHero
        title={factory.name}
        subtitle={company?.name}
        icon={factory.icon}
        onIconChange={(d) => updateItem("factories", factory.id, { icon: d })}
        onEdit={() => {
          const n = prompt("Rename", factory.name);
          if (n?.trim()) updateItem("factories", factory.id, { name: n.trim() });
        }}
      />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[oklch(0.3_0.07_260)]">Machine Group List</h2>
        <AddDialog title="Add machine group" iconOnly onAdd={(name) => addItem("groups", name, factoryId)} />
      </div>
      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No machine groups yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((g) => (
            <ResourceCard
              key={g.id}
              title={g.name}
              subtitle={company?.name}
              to={`/groups/${g.id}`}
              icon={g.icon}
              onIconChange={(d) => updateItem("groups", g.id, { icon: d })}
              onEdit={() => {
                const n = prompt("Rename", g.name);
                if (n?.trim()) updateItem("groups", g.id, { name: n.trim() });
              }}
              onRemove={() => removeItem("groups", g.id)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}