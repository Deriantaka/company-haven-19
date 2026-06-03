import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Pencil, UserPlus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings" }] }),
  component: SettingsPage,
});

type Role = "Manager" | "Engineer" | "MT Team";
type User = { id: string; name: string; email: string; password: string; role: Role };

const ROLES: Role[] = ["Manager", "Engineer", "MT Team"];
const uid = () =>
  crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

function UserFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  title,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: User;
  onSubmit: (u: Omit<User, "id">) => void;
  title: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState(initial?.password ?? "");
  const [role, setRole] = useState<Role>(initial?.role ?? "Engineer");
  const [showPw, setShowPw] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (o) {
          setName(initial?.name ?? "");
          setEmail(initial?.email ?? "");
          setPassword(initial?.password ?? "");
          setRole(initial?.role ?? "Engineer");
          setShowPw(false);
        }
      }}
    >
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !email.trim() || !password.trim()) return;
            onSubmit({ name: name.trim(), email: email.trim(), password, role });
            onOpenChange(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="my-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="u-name">Name</Label>
              <Input id="u-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-email">Email</Label>
              <Input
                id="u-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-pw">Password</Label>
              <div className="relative">
                <Input
                  id="u-pw"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-role">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger id="u-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SettingsPage() {
  const [users, setUsers] = useState<User[]>([
    { id: uid(), name: "Andi Pratama", email: "andi@vibsense.io", password: "demo1234", role: "Manager" },
    { id: uid(), name: "Siti Rahma", email: "siti@vibsense.io", password: "demo1234", role: "Engineer" },
  ]);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const mask = (pw: string) => "•".repeat(Math.min(pw.length, 8));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <h1 className="text-sm font-medium text-muted-foreground">Settings</h1>
          </header>
          <main className="flex-1 p-6 lg:p-8">
            <div className="mx-auto max-w-5xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-sm text-muted-foreground">Preferences and configuration.</p>
              </div>

              <section className="rounded-lg border border-border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                  <div>
                    <h3 className="text-base font-semibold">User Registration</h3>
                    <p className="text-xs text-muted-foreground">
                      Manage who can access the platform.
                    </p>
                  </div>
                  <Button onClick={() => setAddOpen(true)}>
                    <UserPlus className="mr-1 h-4 w-4" /> Add User
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="w-[1%] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                            No users yet. Click "Add User" to register one.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell className="text-muted-foreground">{u.email}</TableCell>
                            <TableCell className="font-mono text-muted-foreground">
                              {mask(u.password)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{u.role}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditing(u)}
                                >
                                  <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() =>
                                    setUsers((list) => list.filter((x) => x.id !== u.id))
                                  }
                                  aria-label="Remove user"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      <UserFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add User"
        onSubmit={(u) => setUsers((list) => [...list, { id: uid(), ...u }])}
      />
      <UserFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title="Edit User"
        initial={editing ?? undefined}
        onSubmit={(u) =>
          setUsers((list) =>
            list.map((x) => (x.id === editing?.id ? { ...x, ...u } : x)),
          )
        }
      />
    </SidebarProvider>
  );
}