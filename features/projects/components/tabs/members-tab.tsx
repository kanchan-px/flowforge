import { getPendingInvitations } from "@/features/invitations/queries/get-pending-invitations";
import { InviteMemberDialog } from "@/features/invitations/components/invite-member-dialog";
import { PendingInvitationsList } from "@/features/invitations/components/pending-invitations-list";
import { MembersList } from "@/features/members/components/members-list";
import { getProjectMembers } from "@/features/members/queries/get-project-members";

interface MembersTabProps {
  projectId: string;
  currentUserId: string;
}

export async function MembersTab({ projectId, currentUserId }: MembersTabProps) {
  const [members, pendingInvitations] = await Promise.all([
    getProjectMembers(projectId),
    getPendingInvitations(projectId),
  ]);

  const currentMembership = members.find(
    (member) => member.user.id === currentUserId,
  );

  const canManageMembers =
    currentMembership?.role === "OWNER" || currentMembership?.role === "ADMIN";

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Members</h2>

          <p className="mt-1 text-sm text-slate-500">
            People with access to this project.
          </p>
        </div>

        {canManageMembers && <InviteMemberDialog projectId={projectId} />}
      </div>

      <MembersList
        members={members}
        currentUserId={currentUserId}
        currentUserRole={currentMembership?.role}
      />

      {canManageMembers && pendingInvitations.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Pending Invitations
          </h3>

          <PendingInvitationsList invitations={pendingInvitations} />
        </div>
      )}
    </div>
  );
}