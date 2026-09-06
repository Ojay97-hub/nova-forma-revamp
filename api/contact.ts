import type { VercelRequest, VercelResponse } from "@vercel/node";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const FROM_EMAIL = "noreply@novaformadesigns.com";
const OWNER_EMAIL = "owen.cotter@novaformadesigns.com";

type Contact = { email: string; name?: string };

/**
 * Brevo's transactional endpoint over plain fetch — no SDK, and no SMTP
 * handshake to pay for on a cold start.
 */
async function sendEmail(payload: {
  sender: Contact;
  to: Contact[];
  replyTo?: Contact;
  subject: string;
  htmlContent: string;
  textContent: string;
}) {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("BREVO_API_KEY is not set");

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": key,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Brevo responded ${response.status}: ${detail.slice(0, 300)}`);
  }

  return response.json().catch(() => ({}));
}

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

/* Plain-text alternatives. A text part lowers spam scoring and covers clients
   that refuse HTML — worth having on mail sent to people who never opted in. */
const notificationText = (name: string, email: string, phone: string | undefined, message: string) =>
  [
    "New enquiry from the Nova Forma contact form",
    "",
    `Name:  ${name}`,
    `Email: ${email}`,
    ...(phone ? [`Phone: ${phone}`] : []),
    "",
    "Message:",
    message,
    "",
    `Reply to ${name}: ${email}`,
  ].join("\n");

const confirmationText = (name: string) =>
  [
    `Thanks for reaching out, ${name.split(" ")[0]}!`,
    "",
    "Your message has landed safely. I'll get back to you — usually within one",
    "working day — to chat about your project.",
    "",
    `In the meantime, you can reach me directly at ${OWNER_EMAIL}.`,
    "",
    `— Owen Cotter, Nova Forma Designs · ${SITE}`,
  ].join("\n");

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

  // Settled, not all: the courtesy auto-reply must never be able to swallow
  // an enquiry. Only the notification reaching Owen decides the response.
  const [notification, confirmation] = await Promise.allSettled([
    sendEmail({
      sender: { email: FROM_EMAIL, name: "Nova Forma" },
      to: [{ email: OWNER_EMAIL, name: "Owen Cotter" }],
      replyTo: { email, name },
      subject: `New enquiry from ${name}`,
      htmlContent: notificationHtml(name, email, phone, message),
      textContent: notificationText(name, email, phone, message),
    }),
    sendEmail({
      sender: { email: FROM_EMAIL, name: "Owen @ Nova Forma" },
      to: [{ email, name }],
      replyTo: { email: OWNER_EMAIL, name: "Owen Cotter" },
      subject: "Thanks for getting in touch — Nova Forma",
      htmlContent: confirmationHtml(name),
      textContent: confirmationText(name),
    }),
  ]);

  if (notification.status === "rejected") {
    console.error("Contact notification failed:", notification.reason);
    return res.status(500).json({ error: "Failed to send message" });
  }

  if (confirmation.status === "rejected") {
    // Logged, not fatal — the enquiry is already safely in Owen's inbox.
    console.error("Contact auto-reply failed (enquiry still delivered):", confirmation.reason);
  }

  return res.status(200).json({ ok: true });
}
