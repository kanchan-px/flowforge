"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function LinkGoogleButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      const { error } = await authClient.linkSocial({
        provider: "google",
        callbackURL: "/workspace",
      });

      if (error) {
        toast.error(error.message ?? "Failed to link Google account.");
        setLoading(false);
      }
    } catch {
      toast.error("Unable to link Google. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? "Connecting..." : "Link Google Account"}
    </Button>
  );
}