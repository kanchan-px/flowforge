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
  <div className="flex min-h-screen bg-slate-100">
    <Sidebar />

    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  </div>
);
}