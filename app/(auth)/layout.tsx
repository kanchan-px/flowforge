import { ReactNode } from "react";
import { Logo } from "@/components/shared/logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-8 px-4">
      <Logo />

      {children}
    </main>
  );
}