import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/resend";

// Turned on with REQUIRE_EMAIL_VERIFICATION=true. Leave it off until Resend
// can deliver to any address (needs a verified domain), otherwise new users
// would never get their link and could not sign in.
const requireEmailVerification =
  process.env.REQUIRE_EMAIL_VERIFICATION === "true";

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
    requireEmailVerification,
  },

  emailVerification: {
    sendOnSignUp: requireEmailVerification,
    sendOnSignIn: requireEmailVerification,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60, // the link works for 1 hour
    sendVerificationEmail: async ({ user, url }) => {
      // Never let a failed email crash sign-up. The person can press
      // "Resend" on the verify page.
      try {
        await sendVerificationEmail({
          to: user.email,
          name: user.name,
          verifyLink: url,
        });
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }
    },
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