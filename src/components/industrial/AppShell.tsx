import { ReactNode, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/lib/api/auth";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; to?: string };

export function AppShell({
  crumbs = [],
  headerRight,
  children,
}: {
  crumbs?: Crumb[];
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  const authed = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // TEMPORARY DEV MODE: send unauthenticated users to the dashboard ("/")
    // instead of "/login" while the backend login API is being fixed.
    // Revert this to navigate({ to: "/login" }) when auth is re-enabled.
    if (!authed) navigate({ to: "/" });
  }, [authed, navigate]);
  // TEMPORARY DEV MODE: render children even when not authenticated.
  // Revert by restoring `if (!authed) return null;` below.
  // if (!authed) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-[image:var(--gradient-header)] px-4 shadow-sm">
            <SidebarTrigger className="text-[oklch(0.25_0.08_260)]" />
            <nav className="flex flex-1 items-center gap-1 text-sm font-semibold text-[oklch(0.28_0.08_260)]">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                  {c.to ? (
                    <Link to={c.to} className="hover:underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="font-bold">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
            {headerRight}
          </header>
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}