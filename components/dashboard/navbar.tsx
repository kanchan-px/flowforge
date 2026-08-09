import { Bell, Search } from "lucide-react";

import { SearchBar } from "./search-bar";
import { UserNav } from "@/components/dashboard/user-nav";

import { getSession } from "@/lib/session";

export async function Navbar() {
  const session = await getSession();

  const name = session?.user.name ?? "Guest";
  const email = session?.user.email ?? "";

  return (
    <header className="mb-8 flex h-16 items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 shadow-sm">
      <SearchBar />

      <div className="flex items-center gap-4">
        <button className="rounded-xl p-2 transition hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
        </button>

        <UserNav
          name={name}
          email={email}
        />
      </div>
    </header>
  );
}