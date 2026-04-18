import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Wedding Invitation" },
      { name: "description", content: "A beautiful wedding invitation, coming soon." },
    ],
  }),
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Save the date 2</p>
        <h1 className="mt-4 text-5xl font-light tracking-tight text-foreground sm:text-6xl">
          Wedding Invitation
        </h1>
        <p className="mt-6 text-base text-muted-foreground">
          Your blank canvas is ready. Tell me the names, date, venue, and style you'd like, and we'll bring it to life.
        </p>
      </div>
    </main>
  );
}
