import { AlertTriangle } from "lucide-react";

export function DangerZone() {
  return (
    <section className="rounded-xl border border-destructive/30 bg-card">
      <div className="border-b border-destructive/20 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Danger Zone
            </h2>

            <p className="text-sm text-muted-foreground">
              Irreversible account actions.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-medium">
            Delete Account
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Permanently delete your FlowForge account and
            associated data.
          </p>
        </div>

        <button
          type="button"
          className="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
        >
          Delete Account
        </button>
      </div>
    </section>
  );
}