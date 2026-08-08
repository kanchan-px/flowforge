import { redirect } from "next/navigation";

import { Sidebar } from "@/components/dashboard/sidebar";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/dashboard/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

return (
  <div className="flex h-screen overflow-hidden bg-slate-100">
    <Sidebar />

    <div className="flex flex-1 min-w-0 flex-col">
      <Navbar />

      <main className="min-h-0 flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  </div>
);
}