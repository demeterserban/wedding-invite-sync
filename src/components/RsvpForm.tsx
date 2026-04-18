import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const rsvpSchema = z
  .object({
    full_name: z.string().trim().min(2, "Numele este obligatoriu").max(120),
    num_persons: z.number().int().min(1).max(20),
    menu_restrictions: z.string().trim().max(500).optional(),
    message: z.string().trim().max(1000).optional(),
    has_children: z.boolean(),
    num_children: z.number().int().min(0).max(20),
    attending: z.boolean(),
  })
  .refine((d) => !d.has_children || d.num_children >= 1, {
    message: "Te rugăm să specifici numărul de copii",
    path: ["num_children"],
  });

export function RsvpForm() {
  const [fullName, setFullName] = useState("");
  const [numPersons, setNumPersons] = useState(1);
  const [menuRestrictions, setMenuRestrictions] = useState("");
  const [message, setMessage] = useState("");
  const [hasChildren, setHasChildren] = useState(false);
  const [numChildren, setNumChildren] = useState(0);
  const [attending, setAttending] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = rsvpSchema.safeParse({
      full_name: fullName,
      num_persons: numPersons,
      menu_restrictions: menuRestrictions || undefined,
      message: message || undefined,
      has_children: hasChildren,
      num_children: hasChildren ? numChildren : 0,
      attending,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Date invalide");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("rsvps").insert(parsed.data);
    setSubmitting(false);

    if (error) {
      toast.error("A apărut o eroare. Te rugăm să încerci din nou.");
      return;
    }

    setSubmitted(true);
    toast.success("Confirmarea ta a fost trimisă. Mulțumim!");
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-gold/40 bg-card p-10 text-center shadow-elegant">
        <p className="font-script text-5xl text-gold">Mulțumim!</p>
        <p className="mt-4 text-lg text-muted-foreground">
          Confirmarea ta a fost înregistrată. Abia așteptăm să te avem alături de noi.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-gold/30 bg-card p-6 shadow-elegant sm:p-10"
    >
      <div className="space-y-2">
        <Label htmlFor="full_name">Nume complet *</Label>
        <Input
          id="full_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          maxLength={120}
          required
          placeholder="Numele și prenumele tău"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="num_persons">Număr persoane *</Label>
          <Input
            id="num_persons"
            type="number"
            min={1}
            max={20}
            value={numPersons}
            onChange={(e) => setNumPersons(Math.max(1, Number(e.target.value) || 1))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attending">Participare</Label>
          <select
            id="attending"
            value={attending ? "yes" : "no"}
            onChange={(e) => setAttending(e.target.value === "yes")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm md:text-sm"
          >
            <option value="yes">Da, voi participa</option>
            <option value="no">Din păcate nu pot</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="menu_restrictions">Restricții meniu</Label>
        <Input
          id="menu_restrictions"
          value={menuRestrictions}
          onChange={(e) => setMenuRestrictions(e.target.value)}
          maxLength={500}
          placeholder="Ex: vegetarian, fără gluten, alergii..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mesaj pentru miri</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Un gând frumos sau orice alte mențiuni..."
        />
      </div>

      <div className="space-y-3 rounded-md border border-gold/20 bg-secondary/40 p-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="has_children"
            checked={hasChildren}
            onCheckedChange={(v) => {
              const checked = v === true;
              setHasChildren(checked);
              if (!checked) setNumChildren(0);
              else if (numChildren < 1) setNumChildren(1);
            }}
          />
          <Label htmlFor="has_children" className="cursor-pointer">
            Vin însoțit/ă de copii
          </Label>
        </div>

        {hasChildren && (
          <div className="space-y-2 pl-7">
            <Label htmlFor="num_children">Număr copii</Label>
            <Input
              id="num_children"
              type="number"
              min={1}
              max={20}
              value={numChildren}
              onChange={(e) => setNumChildren(Math.max(1, Number(e.target.value) || 1))}
              className="max-w-[140px]"
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
        size="lg"
      >
        {submitting ? "Se trimite..." : "Trimite confirmarea"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Confirmările se primesc până la 20 iunie 2026
      </p>
    </form>
  );
}
