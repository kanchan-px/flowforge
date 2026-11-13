"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { GoogleButton } from "@/features/auth/components/google-button";
import { authClient } from "@/lib/auth-client";

import { deleteAccount } from "../actions/delete-account";
import { startDeleteReauth } from "../actions/start-delete-reauth";

interface DangerZoneProps {
  email: string;
  hasPassword: boolean;
  // Computed on the server: true only after "Confirm with Google" was
  // started and a fresh Google sign-in finished.
  reauthConfirmed: boolean;
}

export function DangerZone({
  email,
  hasPassword,
  reauthConfirmed,
}: DangerZoneProps) {
  // After coming back from Google, open the panel by itself.
  const [showConfirmation, setShowConfirmation] = useState(
    !hasPassword && reauthConfirmed,
  );
  const [needsReauth, setNeedsReauth] = useState(!reauthConfirmed);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const canDelete = hasPassword || !needsReauth;

  async function handleStartReauth() {
    const result = await startDeleteReauth();

    if (!result.success) {
      toast.error(result.error);
      return false;
    }

    return true;
  }

  function handleDeleteAccount() {
    if (hasPassword && !currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    startTransition(async () => {
      const result = await deleteAccount(
        hasPassword ? currentPassword : undefined,
      );

      if (!result.success) {
        if (result.requiresReauth) {
          setNeedsReauth(true);
        }

        toast.error(result.error ?? "Failed to delete account.");
        return;
      }

      toast.success("Your account has been deleted.");

      await authClient.signOut();

      window.location.href = "/sign-in";
    });
  }

  function handleCancel() {
    setShowConfirmation(false);
    setCurrentPassword("");
    setShowPassword(false);
  }

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

      <div className="p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-medium">
              Delete Account
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Permanently delete your FlowForge account and
              associated data.
            </p>
          </div>

          {!showConfirmation && (
            <button
              type="button"
              onClick={() => setShowConfirmation(true)}
              className="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
            >
              Delete Account
            </button>
          )}
        </div>

        {showConfirmation && (
          <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-5">
            <h4 className="text-sm font-semibold text-destructive">
              Confirm account deletion
            </h4>

            {hasPassword ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  This action cannot be undone. Enter your current
                  password to permanently delete your account and
                  all associated data.
                </p>

                <div className="mt-4">
                  <label className="text-sm font-medium">
                    Current password
                  </label>

                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      disabled={isPending}
                      placeholder="Enter your current password"
                      className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      disabled={isPending}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : needsReauth ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  This action cannot be undone. You sign in with
                  Google, so please confirm it&apos;s you by
                  signing in with Google again. Choose the account{" "}
                  <span className="font-medium text-foreground">
                    {email}
                  </span>
                  .
                </p>

                <div className="mt-4 max-w-xs">
                  <GoogleButton
                    label="Confirm with Google"
                    callbackURL="/settings"
                    errorCallbackURL="/settings"
                    beforeSignIn={handleStartReauth}
                  />
                </div>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                You&apos;ve confirmed your identity with Google.
                This will permanently delete the account for{" "}
                <span className="font-medium text-foreground">
                  {email}
                </span>{" "}
                and all associated data. This cannot be undone.
              </p>
            )}

            <div className="mt-5 flex gap-3">
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isPending}
                  className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending
                    ? "Deleting Account..."
                    : "Permanently Delete Account"}
                </button>
              )}

              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}