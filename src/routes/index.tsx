import { createFileRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CompanyCard } from "@/components/CompanyCard";
import { AddCompanyDialog } from "@/components/AddCompanyDialog";
import { useCompanies } from "@/hooks/use-companies";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Company Dashboard" },
      { name: "description", content: "Manage your companies — add, remove, and customize icons in one place." },
      { property: "og:title", content: "Company Dashboard" },
      { property: "og:description", content: "Manage your companies in one place." },
    ],
  }),
  component: Index,
});

function Index() {
  const { companies, add, remove, setIcon } = useCompanies();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-sm font-medium text-muted-foreground">Dashboard / Companies</h1>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Company List</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {companies.length} {companies.length === 1 ? "company" : "companies"} managed
                </p>
              </div>
              <AddCompanyDialog onAdd={add} />
            </div>

            {companies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
                <p className="text-muted-foreground">No companies yet. Add your first one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {companies.map((c) => (
                  <CompanyCard key={c.id} company={c} onIconChange={setIcon} onRemove={remove} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
