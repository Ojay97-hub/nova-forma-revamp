import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SITE = "https://novaformadesigns.com";
const LOGO = `${SITE}/logo.png`;
const INK = "#0F2233";
const TEAL = "#3FD2C6";
const CREAM = "#F5F0E8";
const IVORY = "#FAFAF8";

const base = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: ${CREAM}; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: ${INK}; }
    a { color: ${TEAL}; text-decoration: none; }
  </style>
</head>
<body style="background:${CREAM}; padding: 40px 16px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${INK}; border-radius:16px 16px 0 0; padding:28px 36px;">
          <tr>
            <td>
              <img src="${LOGO}" alt="Nova Forma" width="48" height="48" style="display:block; background:${CREAM}; border-radius:12px; padding:8px;" />
              <p style="margin-top:10px; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${TEAL};">Nova Forma Designs</p>
            </td>
          </tr>
        </table>
        <!-- Body -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY}; padding:36px; border-left:2px solid ${INK}; border-right:2px solid ${INK};">
          <tr><td>${content}</td></tr>
        </table>
        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${INK}; border-radius:0 0 16px 16px; padding:20px 36px;">
          <tr>
            <td style="font-size:12px; color:rgba(255,255,255,0.45); text-align:center;">
              © Nova Forma Designs · <a href="${SITE}" style="color:${TEAL};">novaformadesigns.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const notificationHtml = (name: string, email: string, phone: string | undefined, message: string) =>
  base(`
    <h2 style="font-size:22px; font-weight:800; color:${INK}; margin-bottom:6px;">New enquiry 📬</h2>
    <p style="font-size:14px; color:#666; margin-bottom:28px;">Someone filled in your contact form.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:14px 16px; background:${CREAM}; border-radius:10px; border:2px solid ${INK}; margin-bottom:10px;">
          <p style="font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${TEAL}; margin-bottom:4px;">Name</p>
          <p style="font-size:15px; font-weight:600; color:${INK};">${name}</p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:14px 16px; background:${CREAM}; border-radius:10px; border:2px solid ${INK};">
          <p style="font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${TEAL}; margin-bottom:4px;">Email</p>
          <a href="mailto:${email}" style="font-size:15px; font-weight:600; color:${INK};">${email}</a>
        </td>
      </tr>
    </table>
    ${phone ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:14px 16px; background:${CREAM}; border-radius:10px; border:2px solid ${INK};">
          <p style="font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${TEAL}; margin-bottom:4px;">Phone</p>
          <p style="font-size:15px; font-weight:600; color:${INK};">${phone}</p>
        </td>
      </tr>
    </table>` : ""}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:14px 16px; background:${CREAM}; border-radius:10px; border:2px solid ${INK};">
          <p style="font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${TEAL}; margin-bottom:8px;">Message</p>
          <p style="font-size:14px; line-height:1.6; color:${INK}; white-space:pre-wrap;">${message}</p>
        </td>
      </tr>
    </table>

    <a href="mailto:${email}" style="display:inline-block; background:${TEAL}; color:${INK}; font-size:14px; font-weight:700; padding:14px 28px; border-radius:100px; border:2px solid ${INK};">
      Reply to ${name} →
    </a>
  `);

const confirmationHtml = (name: string) =>
  base(`
    <h2 style="font-size:26px; font-weight:800; color:${INK}; margin-bottom:12px;">Thanks for reaching out, ${name.split(" ")[0]}! 👋</h2>
    <p style="font-size:15px; line-height:1.7; color:#444; margin-bottom:24px;">
      Your message has landed safely. I'll get back to you — usually within one working day — to chat about your project.
    </p>
    <p style="font-size:15px; line-height:1.7; color:#444; margin-bottom:32px;">
      In the meantime, feel free to take another look around the site or reach out directly at
      <a href="mailto:owen.cotter@novaformadesigns.com" style="color:${TEAL}; font-weight:600;">owen.cotter@novaformadesigns.com</a>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM}; border-radius:12px; border:2px solid ${INK}; padding:20px 24px; margin-bottom:32px;">
      <tr>
        <td>
          <p style="font-size:13px; font-weight:700; color:${TEAL}; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:6px;">What happens next</p>
          <p style="font-size:14px; line-height:1.6; color:${INK};">I'll review your message and come back with an honest take on how I can help — no jargon, no pressure.</p>
        </td>
      </tr>
    </table>
    <a href="${SITE}" style="display:inline-block; background:${TEAL}; color:${INK}; font-size:14px; font-weight:700; padding:14px 28px; border-radius:100px; border:2px solid ${INK};">
      View the site →
    </a>
  `);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, message } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const [notification, confirmation] = await Promise.all([
    resend.emails.send({
      from: "Nova Forma <noreply@novaformadesigns.com>",
      to: "owen.cotter@novaformadesigns.com",
      replyTo: email,
      subject: `New enquiry from ${name}`,
      html: notificationHtml(name, email, phone, message),
    }),
    resend.emails.send({
      from: "Owen @ Nova Forma <noreply@novaformadesigns.com>",
      to: email,
      replyTo: "owen.cotter@novaformadesigns.com",
      subject: "Thanks for getting in touch — Nova Forma",
      html: confirmationHtml(name),
    }),
  ]);

  if (notification.error || confirmation.error) {
    console.error("Resend error:", notification.error ?? confirmation.error);
    return res.status(500).json({ error: "Failed to send message" });
  }

  return res.status(200).json({ ok: true });
}
