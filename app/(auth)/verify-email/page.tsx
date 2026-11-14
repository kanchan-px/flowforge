import Link from "next/link";
import { redirect } from "next/navigation";
import { MailCheck } from "lucide-react";

import { getSession } from "@/lib/session";
import { ResendVerificationButton } from "@/features/auth/components/resend-verification-button";

interface VerifyEmailPageProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  // If verification isn't being enforced, sign-up already signed them in.
  const session = await getSession();

  if (session) {
    redirect("/workspace");
  }

  const { email } = await searchParams;

  if (typeof email !== "string" || email === "") {
    redirect("/sign-in");
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <MailCheck className="h-7 w-7" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Check your inbox</h1>

        <p className="text-sm text-slate-600">
          We sent a verification link to{" "}
          <span className="font-semibold text-slate-900">{email}</span>. Click
          it to finish setting up your account.
        </p>

        <p className="text-xs text-slate-500">
          Can&apos;t see it? Check your spam folder. The link works for 1 hour.
        </p>
      </div>

      <ResendVerificationButton email={email} />

      <Link
        href="/sign-in"
        className="block text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Back to sign in
      </Link>
    </div>
  );
}