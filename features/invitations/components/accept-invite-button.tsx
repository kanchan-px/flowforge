"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { acceptInvite } from "../actions/accept-invite";

export function AcceptInviteButton({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAccept() {
    setLoading(true);
    const result = await acceptInvite(token);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Invitation accepted!");
    router.push(`/projects/${result.projectId}`);
  }

  return (
    <Button onClick={handleAccept} disabled={loading}>
      {loading ? "Joining..." : "Accept Invitation"}
    </Button>
  );
}