import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/industrial/AppShell";
import { EntityHero } from "@/components/industrial/EntityHero";
import { ResourceCard } from "@/components/industrial/ResourceCard";
import { AddDialog } from "@/components/industrial/AddDialog";
import { useStore, findById } from "@/lib/store";

export const Route = createFileRoute("/companies/$companyId")({
  head: () => ({ meta: [{ title: "Factory List — VIBSENSE" }] }),
  component: Page,
});

function Page() {
  const { companyId } = Route.useParams();
  const { data, addItem, removeItem, updateItem } = useStore();
  const company = findById(data.companies, companyId);
  const factories = data.factories.filter((f) => f.parentId === companyId);

  if (!company) {
    return (
      <AppShell crumbs={[{ label: "Company List", to: "/" }, { label: "Unknown" }]}>
        <p className="text-muted-foreground">Company not found. <Link to="/" className="underline">Back</Link></p>
      </AppShell>
    );
  }

  return (
    <AppShell crumbs={[{ label: company.name }]}>
      <EntityHero
        title={company.name}
        subtitle={company.location}
        icon={company.icon}
        onIconChange={(d) => updateItem("companies", company.id, { icon: d })}
        onEdit={() => {
          const n = prompt("Rename company", company.name);
          if (n?.trim()) updateItem("companies", company.id, { name: n.trim() });
        }}
      />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[oklch(0.3_0.07_260)]">Factory List</h2>
        <AddDialog title="Add factory" iconOnly onAdd={(name) => addItem("factories", name, companyId)} />
      </div>
      {factories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No factories yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {factories.map((f) => (
            <ResourceCard
              key={f.id}
              title={f.name}
              subtitle={company.name}
              to={`/factories/${f.id}`}
              icon={f.icon}
              showMap
              onIconChange={(d) => updateItem("factories", f.id, { icon: d })}
              onEdit={() => {
                const n = prompt("Rename", f.name);
                if (n?.trim()) updateItem("factories", f.id, { name: n.trim() });
              }}
              onRemove={() => removeItem("factories", f.id)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}