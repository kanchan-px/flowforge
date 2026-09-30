import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set in the environment.");
}

if (!process.env.FROM_EMAIL) {
  throw new Error("FROM_EMAIL is not set in the environment.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

type SendInvitationEmailParams = {
  to: string;
  projectName: string;
  inviteLink: string;
};

export async function sendInvitationEmail({
  to,
  projectName,
  inviteLink,
}: SendInvitationEmailParams) {
  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL as string,
    to,
    subject: `You've been invited to join "${projectName}" on FlowForge`,
    html: `
      <p>You've been invited to join the project <strong>${projectName}</strong> on FlowForge.</p>
      <p><a href="${inviteLink}">Click here to accept the invitation</a></p>
      <p>This link will expire in 7 days. If you weren't expecting this, you can ignore this email.</p>
    `,
  });

  if (error) {
    console.error("Resend failed to send invitation email:", error);
    throw new Error("Failed to send invitation email.");
  }

  return data;
}