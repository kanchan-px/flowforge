"use client";
import { authClient } from "@/lib/auth-client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  signInSchema,
  type SignInValues,
} from "../schema";

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const router = useRouter();

async function onSubmit(values: SignInValues) {
  const { error } = await authClient.signIn.email({
    email: values.email,
    password: values.password,
  });

  if (error) {
    toast.error("Failed to sign in.");
    return;
  }

  router.push("/workspace");
  router.refresh();
}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <label>Email</label>

        <Input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-red-500 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label>Password</label>

        <Input
          type="password"
          placeholder="Enter your password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-sm text-red-500 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
}