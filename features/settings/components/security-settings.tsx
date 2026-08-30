import { Shield } from "lucide-react";

export function SecuritySettings() {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Shield className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Security</h2>

            <p className="text-sm text-muted-foreground">
              Manage your password and account security.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div>
          <h3 className="text-sm font-medium">
            Password
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Update your password to keep your account secure.
          </p>

          <button
            type="button"
            className="mt-4 rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Change Password
          </button>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-sm font-medium">
            Current session
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Sign out from your current FlowForge session.
          </p>

          <button
            type="button"
            className="mt-4 rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Log Out
          </button>
        </div>
      </div>
    </section>
  );
}