"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { acceptInvite } from "../actions/accept-invite";
import { declineInvite } from "../actions/decline-invite";

type MyInvitation = {
  id: string;
  token: string;
  role: string;
  expiresAt: Date;
  project: { id: string; name: string; description: string | null };
  invitedBy: { name: string };
};

export function MyInvitationsList({
  invitations,
}: {
  invitations: MyInvitation[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  if (invitations.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-20 text-center">
        <h3 className="text-xl font-bold text-slate-800">No pending invitations</h3>
        <p className="mt-2 text-slate-500">
          When someone invites you to a project, it will show up here.
        </p>
      </div>
    );
  }

  async function handleAccept(invitation: MyInvitation) {
    setBusyId(invitation.id);
    const result = await acceptInvite(invitation.token);
    setBusyId(null);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Invitation accepted!");
    router.push(`/projects/${result.projectId}`);
  }

  async function handleDecline(invitationId: string) {
    setBusyId(invitationId);
    const result = await declineInvite(invitationId);
    setBusyId(null);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Invitation declined.");
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {invitation.project.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {invitation.invitedBy.name} invited you as{" "}
              {invitation.role === "ADMIN" ? "an admin" : "a member"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Expires {new Date(invitation.expiresAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={busyId === invitation.id}
              onClick={() => handleDecline(invitation.id)}
            >
              Decline
            </Button>
            <Button
              disabled={busyId === invitation.id}
              onClick={() => handleAccept(invitation)}
            >
              {busyId === invitation.id ? "Working..." : "Accept"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}