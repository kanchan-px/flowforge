import { AuthCard } from "@/components/shared/auth-card";
import { AuthHeader } from "@/components/shared/auth-header";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect("/workspace");
  }
  return (
    <AuthCard>
      <AuthHeader
        title="Create an Account"
        description="Sign up to start using FlowForge"
      />

      <SignUpForm />
    </AuthCard>
  );
}