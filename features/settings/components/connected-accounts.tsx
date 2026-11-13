import { Check, UserCheck } from "lucide-react";

import { LinkGoogleButton } from "./LinkGoogleButton";

interface ConnectedAccountsProps {
  hasGoogle: boolean;
  hasPassword: boolean;
}

export function ConnectedAccounts({
  hasGoogle,
  hasPassword,
}: ConnectedAccountsProps) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <UserCheck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Connected accounts
            </h2>

            <p className="text-sm text-muted-foreground">
              The ways you can sign in to FlowForge.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y">
        <div className="flex flex-col justify-between gap-3 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-medium">Google</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {hasGoogle
                ? "You can sign in to FlowForge with your Google account."
                : "Link Google to sign in with one click."}
            </p>
          </div>

          {hasGoogle ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Check className="h-3.5 w-3.5" />
              Connected
            </span>
          ) : (
            <LinkGoogleButton />
          )}
        </div>

        <div className="flex flex-col justify-between gap-3 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-medium">Email and password</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {hasPassword
                ? "You can sign in with your email and password."
                : "Not set up. You sign in with Google."}
            </p>
          </div>

          {hasPassword && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Check className="h-3.5 w-3.5" />
              Enabled
            </span>
          )}
        </div>
      </div>
    </section>
  );
}