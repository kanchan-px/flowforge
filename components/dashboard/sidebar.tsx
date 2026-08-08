"use client";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { SidebarItem } from "./sidebar-item";
// import { SignOutButton } from "@/components/shared/sign-out-button";

const routes = [
  {
    href: "/workspace",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    href: "/tasks",
    label: "My Tasks",
    icon: CheckSquare,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-[278px] shrink-0 flex-col border-r bg-white">
      <div className="border-b p-4">
        <Logo />
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            href={route.href}
            label={route.label}
            icon={route.icon}
          />
        ))}
      </nav>
    </aside>
  );
}