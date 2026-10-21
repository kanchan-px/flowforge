"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ProjectRole } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { removeMember } from "../actions/remove-member";
import { updateMemberRole } from "../actions/update-member-role";

const roleLabels: Record<ProjectRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

interface MemberActionsProps {
  memberId: string;
  memberUserId: string;
  memberName: string;
  role: ProjectRole;
  currentUserId: string;
  currentUserRole: ProjectRole | undefined;
}

export function MemberActions({
  memberId,
  memberUserId,
  memberName,
  role,
  currentUserId,
  currentUserRole,
}: MemberActionsProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const isSelf = memberUserId === currentUserId;

  const canChangeRole = currentUserRole === "OWNER" && role !== "OWNER";

  const canRemove =
    role !== "OWNER" &&
    (isSelf ||
      currentUserRole === "OWNER" ||
      (currentUserRole === "ADMIN" && role === "MEMBER"));

  async function handleRoleChange(nextRole: string) {
    if (nextRole === role) {
      return;
    }

    setBusy(true);
    const result = await updateMemberRole(memberId, nextRole);
    setBusy(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Role updated.");
  }

  async function handleRemove() {
    setBusy(true);
    const result = await removeMember(memberId);
    setBusy(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setConfirmOpen(false);

    if (result.left) {
      toast.success("You left the project.");
      router.push("/projects");
      return;
    }

    toast.success(`${memberName} was removed.`);
  }

  return (
    <div className="flex items-center gap-2">
      {canChangeRole ? (
        <Select
          value={role}
          disabled={busy}
          onValueChange={(value) => {
            if (value) {
              handleRoleChange(value);
            }
          }}
        >
          <SelectTrigger className="h-8 w-28">
            <SelectValue>{roleLabels[role]}</SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <span className="text-xs font-medium uppercase text-muted-foreground">
          {roleLabels[role]}
        </span>
      )}

      {canRemove && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-red-600 transition hover:bg-red-50">
            {isSelf ? "Leave" : "Remove"}
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isSelf ? "Leave this project?" : `Remove ${memberName}?`}
              </DialogTitle>

              <DialogDescription>
                {isSelf
                  ? "You'll lose access to this project, and any tasks assigned to you will become unassigned."
                  : "They'll lose access to this project, and any tasks assigned to them will become unassigned."}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={busy}
                onClick={handleRemove}
              >
                {busy ? "Working..." : isSelf ? "Leave project" : "Remove"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}