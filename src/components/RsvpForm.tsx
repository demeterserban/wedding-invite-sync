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
    attending_aug_23: z.boolean(),
    attending_aug_29: z.boolean(),
  })
  .refine((d) => !d.has_children || d.num_children >= 1, {
    message: "Te rugăm să specifici numărul de copii",
    path: ["num_children"],
  })
  .refine((d) => !d.attending || d.attending_aug_23 || d.attending_aug_29, {
    message: "Te rugăm să selectezi cel puțin un eveniment la care vei participa",
    path: ["attending_aug_23"],
  });

export function RsvpForm() {
  const [names, setNames] = useState<string[]>([""]);
  const [numPersons, setNumPersons] = useState(1);
  const [menuRestrictions, setMenuRestrictions] = useState("");

  const updateNumPersons = (n: number) => {
    setNumPersons(n);
    setNames((prev) => {
      if (prev.length === n) return prev;
      if (prev.length < n) return [...prev, ...Array(n - prev.length).fill("")];
      return prev.slice(0, n);
    });
  };
  const [message, setMessage] = useState("");
  const [hasChildren, setHasChildren] = useState(false);
  const [numChildren, setNumChildren] = useState(0);
  const [attending, setAttending] = useState(true);
  const [attendingAug23, setAttendingAug23] = useState(true);
  const [attendingAug29, setAttendingAug29] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const joinedName = names
      .map((n) => n.trim())
      .filter((n) => n.length > 0)
      .join(", ");

    const parsed = rsvpSchema.safeParse({
      full_name: joinedName,
      num_persons: numPersons,
      menu_restrictions: menuRestrictions || undefined,
      message: message || undefined,
      has_children: hasChildren,
      num_children: hasChildren ? numChildren : 0,
      attending,
      attending_aug_23: attending ? attendingAug23 : false,
      attending_aug_29: attending ? attendingAug29 : false,
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
          {numPersons > 1
            ? "Confirmarea voastră a fost înregistrată. Abia așteptăm să vă avem alături de noi."
            : "Confirmarea ta a fost înregistrată. Abia așteptăm să te avem alături de noi."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-gold/30 bg-card p-6 shadow-elegant sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="num_persons">Număr persoane <span className="text-gold">✦</span></Label>
          <select
            id="num_persons"
            value={numPersons}
            onChange={(e) => updateNumPersons(Number(e.target.value))}
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm md:text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
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

      {numPersons === 1 ? (
        <div className="space-y-2">
          <Label htmlFor="full_name_0">Invitat <span className="text-gold">✦</span></Label>
          <Input
            id="full_name_0"
            value={names[0] ?? ""}
            onChange={(e) => setNames([e.target.value])}
            maxLength={120}
            required
            placeholder="Numele și prenumele tău"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {names.map((name, i) => (
            <div key={i} className="space-y-2">
              <Label htmlFor={`full_name_${i}`}>Invitat {i + 1} <span className="text-gold">✦</span></Label>
              <Input
                id={`full_name_${i}`}
                value={name}
                onChange={(e) =>
                  setNames((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
                }
                maxLength={120}
                required
                placeholder="Numele și prenumele tău"
              />
            </div>
          ))}
        </div>
      )}

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

      {attending && (
        <div className="space-y-3 rounded-md border border-gold/20 bg-secondary/40 p-4">
          <p className="text-sm font-medium text-foreground">
            La ce evenimente vei participa? <span className="text-gold">✦</span>
          </p>
          <div className="flex items-start gap-3">
            <Checkbox
              id="attending_aug_23"
              checked={attendingAug23}
              onCheckedChange={(v) => setAttendingAug23(v === true)}
              className="mt-1"
            />
            <Label htmlFor="attending_aug_23" className="cursor-pointer leading-snug">
              <span className="font-medium">23 August</span>
              <span className="block text-xs text-muted-foreground">
                Cununia civilă, religioasă & Splash Party (Cheriu)
              </span>
            </Label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="attending_aug_29"
              checked={attendingAug29}
              onCheckedChange={(v) => setAttendingAug29(v === true)}
              className="mt-1"
            />
            <Label htmlFor="attending_aug_29" className="cursor-pointer leading-snug">
              <span className="font-medium">29 August</span>
              <span className="block text-xs text-muted-foreground">
                Seara de nuntă la Palazzo
              </span>
            </Label>
          </div>
          {!attendingAug23 && !attendingAug29 && (
            <p className="text-xs text-destructive">
              Te rugăm să selectezi cel puțin un eveniment.
            </p>
          )}
        </div>
      )}

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
            <select
              id="num_children"
              value={numChildren}
              onChange={(e) => setNumChildren(Number(e.target.value))}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm md:text-sm"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
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
        <span className="text-gold">✦</span> Câmpurile marcate sunt necesare
      </p>
    </form>
  );
}
