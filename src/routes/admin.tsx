import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Users, Baby, Utensils, MessageSquare, Trash2 } from "lucide-react";

type Rsvp = {
  id: string;
  full_name: string;
  num_persons: number;
  menu_restrictions: string | null;
  message: string | null;
  has_children: boolean;
  num_children: number;
  attending: boolean;
  created_at: string;
};

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Confirmări" }] }),
});

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/login" });
        return;
      }

      // Check admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");

      if (!mounted) return;

      if (!roles || roles.length === 0) {
        toast.error("Nu ai permisiuni de administrator.");
        await supabase.auth.signOut();
        navigate({ to: "/login" });
        return;
      }

      setAuthorized(true);
      await loadRsvps();
      setLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate({ to: "/login" });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const loadRsvps = async () => {
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Eroare la încărcarea confirmărilor");
      return;
    }
    setRsvps((data ?? []) as Rsvp[]);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur vrei să ștergi această confirmare?")) return;
    const { error } = await supabase.from("rsvps").delete().eq("id", id);
    if (error) {
      toast.error("Eroare la ștergere");
      return;
    }
    setRsvps((prev) => prev.filter((r) => r.id !== id));
    toast.success("Confirmare ștearsă");
  };

  const exportCsv = () => {
    const header = ["Nume", "Participă", "Persoane", "Copii", "Nr copii", "Restricții meniu", "Mesaj", "Trimis la"];
    const rows = rsvps.map((r) => [
      r.full_name,
      r.attending ? "Da" : "Nu",
      String(r.num_persons),
      r.has_children ? "Da" : "Nu",
      String(r.num_children),
      r.menu_restrictions ?? "",
      r.message ?? "",
      new Date(r.created_at).toLocaleString("ro-RO"),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `confirmari-nunta-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Se încarcă...</p>
      </div>
    );
  }

  if (!authorized) return null;

  const totalAttending = rsvps.filter((r) => r.attending);
  const totalPersons = totalAttending.reduce((s, r) => s + r.num_persons, 0);
  const totalChildren = totalAttending.reduce((s, r) => s + r.num_children, 0);

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Panou Admin</p>
            <h1 className="mt-2 font-serif text-3xl text-foreground">Confirmări nuntă</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-gold self-center">
              ← Invitație
            </Link>
            <Button variant="outline" onClick={exportCsv} disabled={rsvps.length === 0}>
              Export CSV
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Ieșire
            </Button>
          </div>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Confirmări totale" value={rsvps.length} icon={<Users className="h-5 w-5" />} />
          <StatCard label="Adulți confirmați" value={totalPersons} icon={<Users className="h-5 w-5" />} />
          <StatCard label="Copii" value={totalChildren} icon={<Baby className="h-5 w-5" />} />
        </div>

        <div className="mt-8 space-y-4">
          {rsvps.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
              Nu există încă nicio confirmare.
            </div>
          )}

          {rsvps.map((r) => (
            <article
              key={r.id}
              className="rounded-lg border border-gold/30 bg-card p-6 shadow-elegant"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl text-foreground">{r.full_name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("ro-RO")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      r.attending
                        ? "bg-gold/20 text-gold"
                        : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {r.attending ? "Participă" : "Nu participă"}
                  </span>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Șterge"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gold" />
                  <span className="text-muted-foreground">Persoane:</span>
                  <span className="font-medium text-foreground">{r.num_persons}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Baby className="h-4 w-4 text-gold" />
                  <span className="text-muted-foreground">Copii:</span>
                  <span className="font-medium text-foreground">
                    {r.has_children ? r.num_children : "—"}
                  </span>
                </div>
                {r.menu_restrictions && (
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <Utensils className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <div>
                      <p className="text-xs text-muted-foreground">Restricții meniu</p>
                      <p className="text-foreground">{r.menu_restrictions}</p>
                    </div>
                  </div>
                )}
                {r.message && (
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mesaj</p>
                      <p className="whitespace-pre-wrap text-foreground">{r.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gold/30 bg-card p-5 shadow-elegant">
      <div className="flex items-center gap-3 text-gold">
        {icon}
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 font-serif text-4xl text-foreground">{value}</p>
    </div>
  );
}
