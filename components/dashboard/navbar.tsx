import { Search } from "lucide-react";

import { SearchBar } from "./search-bar";
import { NotificationDropdown } from "@/features/notifications/components/notification-dropdown";
import { UserNav } from "@/components/dashboard/user-nav";

import { getSession } from "@/lib/session";
import { getNotifications } from "@/features/notifications/queries/get-notifications";

export async function Navbar() {
  const session = await getSession();

  const name = session?.user.name ?? "Guest";
  const email = session?.user.email ?? "";

  const { notifications, unreadCount } =
    await getNotifications();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
        />

        <UserNav
          name={name}
          email={email}
        />
      </div>
    </header>
  );
}