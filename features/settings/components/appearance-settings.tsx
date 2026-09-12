import { Palette } from "lucide-react";

export function AppearanceSettings() {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Palette className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Appearance</h2>

            <p className="text-sm text-muted-foreground">
              Customize how FlowForge looks.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div>
          <h3 className="text-sm font-medium">Theme</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose how FlowForge should appear.
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            className="rounded-lg border p-4 text-left transition hover:bg-muted"
          >
            <p className="font-medium">Light</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Always use light mode
            </p>
          </button>

          <button
            type="button"
            className="rounded-lg border p-4 text-left transition hover:bg-muted"
          >
            <p className="font-medium">Dark</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Always use dark mode
            </p>
          </button>

          <button
            type="button"
            className="rounded-lg border p-4 text-left transition hover:bg-muted"
          >
            <p className="font-medium">System</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Follow your system preference
            </p>
          </button>
        </div>
      </div>
    </section>
  );
}