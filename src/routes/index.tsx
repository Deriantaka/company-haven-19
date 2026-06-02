import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/industrial/AppShell";
import { ResourceCard } from "@/components/industrial/ResourceCard";
import { AddCompanyDialog } from "@/components/AddCompanyDialog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Company List — VIBSENSE" },
      { name: "description", content: "Industrial monitoring dashboard. Manage companies, factories, machines and sensors." },
      { property: "og:title", content: "VIBSENSE Dashboard" },
      { property: "og:description", content: "Industrial monitoring dashboard." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data, addItem, removeItem, updateItem } = useStore();
  const companies = data.companies;

  return (
    <AppShell crumbs={[{ label: "Company List" }]}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-[oklch(0.3_0.07_260)]">
            Company List
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {companies.length} {companies.length === 1 ? "company" : "companies"} managed
          </p>
        </div>
        <AddCompanyDialog onAdd={(name, location) => addItem("companies", name, undefined, { location })} />
      </div>
      {companies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <p className="text-muted-foreground">No companies yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((c) => (
            <ResourceCard
              key={c.id}
              title={c.name}
              subtitle={c.location}
              to={`/companies/${c.id}`}
              icon={c.icon}
              onIconChange={(d) => updateItem("companies", c.id, { icon: d })}
              onRemove={() => removeItem("companies", c.id)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
