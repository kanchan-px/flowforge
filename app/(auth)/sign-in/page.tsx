import { AuthCard } from "@/components/shared/auth-card";
import { AuthHeader } from "@/components/shared/auth-header";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect("/workspace");
  }


  return (
    <AuthCard>
      <AuthHeader
        title="Welcome Back"
        description="Sign in to continue to FlowForge"
      />

      <div className="text-center text-sm text-muted-foreground">
        <SignInForm />
      </div>
    </AuthCard>
  );
}