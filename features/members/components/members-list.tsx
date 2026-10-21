import type { ProjectRole } from "@prisma/client";

import { MemberActions } from "./member-actions";

type Member = {
  id: string;
  role: ProjectRole;
  user: { id: string; name: string; email: string; image: string | null };
};

export function MembersList({
  members,
  currentUserId,
  currentUserRole,
}: {
  members: Member[];
  currentUserId: string;
  currentUserRole: ProjectRole | undefined;
}) {
  return (
    <ul className="space-y-2">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex items-center justify-between gap-3 rounded-md border p-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {member.user.name}
              {member.user.id === currentUserId && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  (you)
                </span>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {member.user.email}
            </p>
          </div>

          <MemberActions
            memberId={member.id}
            memberUserId={member.user.id}
            memberName={member.user.name}
            role={member.role}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        </li>
      ))}
    </ul>
  );
}