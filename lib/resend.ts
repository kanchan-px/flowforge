import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set in the environment.");
}

if (!process.env.FROM_EMAIL) {
  throw new Error("FROM_EMAIL is not set in the environment.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Anything a user typed (names, project titles) must be escaped before it
// goes into an HTML email, so it can't add its own links or tags.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL as string,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend failed to send email:", error);
    throw new Error("Failed to send email.");
  }

  return data;
}

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
  return sendEmail({
    to,
    subject: `You've been invited to join "${projectName}" on FlowForge`,
    html: `
      <p>You've been invited to join the project <strong>${escapeHtml(projectName)}</strong> on FlowForge.</p>
      <p><a href="${escapeHtml(inviteLink)}">Click here to accept the invitation</a></p>
      <p>This link will expire in 7 days. If you weren't expecting this, you can ignore this email.</p>
    `,
  });
}

type SendVerificationEmailParams = {
  to: string;
  name: string;
  verifyLink: string;
};

export async function sendVerificationEmail({
  to,
  name,
  verifyLink,
}: SendVerificationEmailParams) {
  return sendEmail({
    to,
    subject: "Verify your email for FlowForge",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Verify your email</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for signing up for FlowForge. Please confirm this is your email address to finish setting up your account.</p>
        <p style="margin: 28px 0;">
          <a href="${escapeHtml(verifyLink)}"
             style="background: #2563eb; color: #ffffff; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Verify email
          </a>
        </p>
        <p style="font-size: 13px; color: #64748b;">This link expires in 1 hour. If you didn't create a FlowForge account, you can safely ignore this email.</p>
      </div>
    `,
  });
}