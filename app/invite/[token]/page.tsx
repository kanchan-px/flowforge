import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getInvitationByToken } from "@/features/invitations/queries/get-invitation-by-token";
import { AcceptInviteButton } from "@/features/invitations/components/accept-invite-button";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const invitation = await getInvitationByToken(token);
  const session = await auth.api.getSession({ headers: await headers() });

  if (!invitation) {
    return <InviteShell><p>This invitation link is invalid.</p></InviteShell>;
  }

  if (invitation.status === "REVOKED") {
    return <InviteShell><p>This invitation has been revoked by the project owner.</p></InviteShell>;
  }

  if (invitation.status === "ACCEPTED") {
    return <InviteShell><p>This invitation has already been accepted.</p></InviteShell>;
  }

  if (invitation.expiresAt < new Date()) {
    return <InviteShell><p>This invitation has expired. Ask the project owner to send a new one.</p></InviteShell>;
  }

  if (!session) {
    return (
      <InviteShell>
        <p>You&apos;ve been invited to join <strong>{invitation.project.name}</strong>.</p>
        <p>Sign in or create an account using <strong>{invitation.email}</strong>, then come back to this page to accept.</p>
        <div className="flex justify-center gap-4">
          <Link href="/sign-in" className="underline">Sign in</Link>
          <Link href="/sign-up" className="underline">Sign up</Link>
        </div>
      </InviteShell>
    );
  }

  if (session.user.email !== invitation.email) {
    return (
      <InviteShell>
        <p>
          This invitation was sent to <strong>{invitation.email}</strong>, but you&apos;re signed in as{" "}
          <strong>{session.user.email}</strong>.
        </p>
        <p>Sign out and sign back in with the invited email to accept.</p>
      </InviteShell>
    );
  }

  return (
    <InviteShell>
      <p>
        <strong>{invitation.invitedBy.name}</strong> invited you to join{" "}
        <strong>{invitation.project.name}</strong> as {invitation.role === "ADMIN" ? "an admin" : "a member"}.
      </p>
      <AcceptInviteButton token={token} />
    </InviteShell>
  );
}

function InviteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md space-y-4 text-center">{children}</div>
    </div>
  );
}