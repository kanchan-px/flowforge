type Member = {
  id: string;
  role: string;
  user: { id: string; name: string; email: string; image: string | null };
};

export function MembersList({ members }: { members: Member[] }) {
  return (
    <ul className="space-y-2">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div>
            <p className="text-sm font-medium">{member.user.name}</p>
            <p className="text-xs text-muted-foreground">{member.user.email}</p>
          </div>
          <span className="text-xs font-medium uppercase text-muted-foreground">
            {member.role}
          </span>
        </li>
      ))}
    </ul>
  );
}