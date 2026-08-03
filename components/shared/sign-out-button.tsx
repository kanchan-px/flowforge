"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();

    router.push("/sign-in");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      className="w-full justify-center"
    >
      Sign Out
    </Button>
  );
}
