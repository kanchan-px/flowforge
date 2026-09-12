"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import {
changePasswordSchema,
type ChangePasswordInput,
} from "../schemas/change-password-schema";

export async function changePassword(
values: ChangePasswordInput,
) {
const validated =
changePasswordSchema.safeParse(values);

if (!validated.success) {
return {
success: false,
error: "Invalid password data.",
};
}

const session = await auth.api.getSession({
headers: await headers(),
});

if (!session?.user) {
return {
success: false,
error: "Unauthorized.",
};
}

try {
await auth.api.changePassword({
body: {
currentPassword:
validated.data.currentPassword,
newPassword:
validated.data.newPassword,
revokeOtherSessions: true,
},
headers: await headers(),
});

return {
  success: true,
};

} catch (error) {
console.error(
"Failed to change password:",
error,
);

return {
  success: false,
  error: "Failed to change password.",
};

}
}
