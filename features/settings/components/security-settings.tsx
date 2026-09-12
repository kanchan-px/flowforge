"use client";

import { useState, useTransition } from "react";
import {
  Eye,
  EyeOff,
  LogOut,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { changePassword } from "../actions/change-password";

export function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isPending, startTransition] = useTransition();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  function handleChangePassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    startTransition(async () => {
      const result = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        toast.error(
          result.error ?? "Failed to change password.",
        );
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password changed successfully.");
    });
  }

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in";
        },
      },
    });
  }

  return (
    <section className="rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Shield className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Security
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage your password and account security.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Change Password */}
        <form
          onSubmit={handleChangePassword}
          className="space-y-5"
        >
          <div>
            <h3 className="text-sm font-medium">
              Password
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Update your password to keep your account secure.
            </p>
          </div>

          {/* Current Password */}
          <PasswordInput
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            showPassword={showCurrentPassword}
            onToggleVisibility={() =>
              setShowCurrentPassword(
                (previous) => !previous,
              )
            }
            disabled={isPending}
          />

          {/* New Password */}
          <PasswordInput
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            showPassword={showNewPassword}
            onToggleVisibility={() =>
              setShowNewPassword(
                (previous) => !previous,
              )
            }
            disabled={isPending}
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            showPassword={showConfirmPassword}
            onToggleVisibility={() =>
              setShowConfirmPassword(
                (previous) => !previous,
              )
            }
            disabled={isPending}
          />

          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Changing Password..."
              : "Change Password"}
          </button>
        </form>

        {/* Logout */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium">
            Current session
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Sign out from your current FlowForge session.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </div>
    </section>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          disabled={disabled}
          className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          disabled={disabled}
          aria-label={
            showPassword
              ? `Hide ${label}`
              : `Show ${label}`
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
  );
}