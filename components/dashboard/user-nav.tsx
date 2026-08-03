"use client";

import { LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface UserNavProps {
  name: string;
  email: string;
}

export function UserNav({ name, email }: UserNavProps) {
  const initial = name.charAt(0).toUpperCase();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/sign-in";
        },
      },
    });
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
          {initial}
        </div>

        <div className="hidden md:block">
          <p className="text-sm font-semibold text-slate-900">
            {name}
          </p>

          <p className="text-xs text-slate-500">
            {email}
          </p>
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}