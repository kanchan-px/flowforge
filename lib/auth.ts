import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/prisma";

// Website addresses allowed to talk to the login system.
// localhost is only allowed while developing.
const trustedOrigins = [
  process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined,
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  trustedOrigins,
});