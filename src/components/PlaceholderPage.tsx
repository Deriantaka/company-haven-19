import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <h1 className="text-sm font-medium text-muted-foreground">{title}</h1>
          </header>
          <main className="flex flex-1 items-center justify-center p-8">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-muted-foreground">{description}</p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}