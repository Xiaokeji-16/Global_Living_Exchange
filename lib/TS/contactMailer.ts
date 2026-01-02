// lib/TS/contactMailer.ts
import { Resend } from "resend";
import type { ContactRequestPayload } from "./contactService";

// 防御：没有配置就直接不要发邮件
const apiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.CONTACT_NOTIFY_EMAIL;

// 如果没配置，就不要初始化 Resend，避免报错
const resend = apiKey ? new Resend(apiKey) : null;

export async function sendContactNotification(
  payload: ContactRequestPayload
) {
  if (!resend || !toEmail) {
    console.warn(
      "[contactMailer] RESEND_API_KEY or CONTACT_NOTIFY_EMAIL not set, skip sending email."
    );
    return;
  }

  const { name, email, messageType, message } = payload;

  const subject = `[GLE] New contact request (${messageType || "General"})`;
  const plainText = `
New contact request from Global Living Exchange:

Name: ${name}
Email: ${email}
Type: ${messageType || "N/A"}

Message:
${message}
`.trim();

  try {
    const { error } = await resend.emails.send({
      from: "Global Living Exchange <no-reply@glexample.com>",
      to: [toEmail],
      subject,
      text: plainText,
    });

    if (error) {
      console.error("[contactMailer] Resend error:", error);
    }
  } catch (err) {
    console.error("[contactMailer] Unexpected error:", err);
  }
}