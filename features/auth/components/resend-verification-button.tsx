"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

// An email was just sent when this page opened, so start with a short wait.
const FIRST_WAIT_SECONDS = 30;
const WAIT_BETWEEN_SENDS_SECONDS = 60;

export function ResendVerificationButton({ email }: { email: string }) {
  const [secondsLeft, setSecondsLeft] = useState(FIRST_WAIT_SECONDS);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  async function handleResend() {
    setSending(true);

    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/workspace",
      });

      if (error) {
        toast.error(error.message ?? "Couldn't send the email. Please try again.");
        return;
      }

      toast.success("If that address has an account, a new link is on its way.");
      setSecondsLeft(WAIT_BETWEEN_SENDS_SECONDS);
    } catch {
      toast.error("Couldn't send the email. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={sending || secondsLeft > 0}
      onClick={handleResend}
    >
      {sending
        ? "Sending..."
        : secondsLeft > 0
          ? `Resend email in ${secondsLeft}s`
          : "Resend verification email"}
    </Button>
  );
}