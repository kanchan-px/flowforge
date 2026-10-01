"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { revokeInvite } from "../actions/revoke-invite";

type PendingInvitation = {
  id: string;
  email: string;
  role: string;
  expiresAt: Date;
};

export function PendingInvitationsList({
  invitations,
}: {
  invitations: PendingInvitation[];
}) {
  const [revokingId, setRevokingId] = useState<string | null>(null);

  if (invitations.length === 0) {
    return <p className="text-sm text-muted-foreground">No pending invitations.</p>;
  }

  async function handleRevoke(id: string) {
    setRevokingId(id);
    const result = await revokeInvite(id);
    setRevokingId(null);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Invitation revoked.");
  }

  return (
    <ul className="space-y-2">
      {invitations.map((invitation) => (
        <li
          key={invitation.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div>
            <p className="text-sm font-medium">{invitation.email}</p>
            <p className="text-xs text-muted-foreground">
              {invitation.role === "ADMIN" ? "Admin" : "Member"} · pending
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={revokingId === invitation.id}
            onClick={() => handleRevoke(invitation.id)}
          >
            {revokingId === invitation.id ? "Revoking..." : "Revoke"}
          </Button>
        </li>
      ))}
    </ul>
  );
}