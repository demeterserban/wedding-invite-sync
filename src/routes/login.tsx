import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Autentificare — Admin" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Bine ai revenit!");
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Cont creat. Cere admin-ului să îți acorde rolul de administrator.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Acces restricționat</p>
          <h1 className="mt-3 font-serif text-3xl text-foreground">Panou administrare</h1>
          <div className="divider-gold mx-auto mt-4 w-24" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-lg border border-gold/30 bg-card p-8 shadow-elegant"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Parolă</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
          >
            {loading ? "Se procesează..." : mode === "login" ? "Autentificare" : "Creează cont"}
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="block w-full text-center text-sm text-muted-foreground hover:text-gold"
          >
            {mode === "login" ? "Nu ai cont? Înregistrează-te" : "Ai deja cont? Autentifică-te"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-gold">
            ← Înapoi la invitație
          </Link>
        </div>
      </div>
    </main>
  );
}
