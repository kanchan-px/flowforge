import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";
import { getMyInvitations } from "@/features/invitations/queries/get-my-invitations";
import { MyInvitationsList } from "@/features/invitations/components/my-invitations-list";

export default async function InvitationsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const invitations = await getMyInvitations(session.user.email);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Invitations</h1>
        <p className="text-slate-500">Project invitations sent to you</p>
      </div>

      <MyInvitationsList invitations={invitations} />
    </div>
  );
}