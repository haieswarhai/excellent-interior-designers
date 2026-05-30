import { Resend } from "resend";
import { logger } from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "Maison Intérieure <onboarding@resend.dev>";
const NOTIFY_ADDRESS = process.env.NOTIFY_EMAIL ?? "studio@maisoninterieure.com";

export async function sendInquiryNotification(inquiry: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  projectType?: string | null;
  budget?: string | null;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [NOTIFY_ADDRESS],
      subject: `New Inquiry from ${inquiry.name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2c2c2c;">
          <div style="border-bottom: 2px solid #c9a96e; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="font-size: 22px; font-weight: normal; letter-spacing: 0.1em; margin: 0; color: #1a1a1a;">
              MAISON INTÉRIEURE
            </h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: #888; letter-spacing: 0.05em; font-family: sans-serif;">
              NEW CLIENT INQUIRY
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; color: #888; width: 140px;">Name</td>
              <td style="padding: 10px 0; font-weight: 600; color: #1a1a1a;">${inquiry.name}</td>
            </tr>
            <tr style="border-top: 1px solid #f0ece4;">
              <td style="padding: 10px 0; color: #888;">Email</td>
              <td style="padding: 10px 0;">
                <a href="mailto:${inquiry.email}" style="color: #c9a96e; text-decoration: none;">${inquiry.email}</a>
              </td>
            </tr>
            ${inquiry.phone ? `
            <tr style="border-top: 1px solid #f0ece4;">
              <td style="padding: 10px 0; color: #888;">Phone</td>
              <td style="padding: 10px 0;">${inquiry.phone}</td>
            </tr>` : ""}
            ${inquiry.projectType ? `
            <tr style="border-top: 1px solid #f0ece4;">
              <td style="padding: 10px 0; color: #888;">Project Type</td>
              <td style="padding: 10px 0;">${inquiry.projectType}</td>
            </tr>` : ""}
            ${inquiry.budget ? `
            <tr style="border-top: 1px solid #f0ece4;">
              <td style="padding: 10px 0; color: #888;">Budget</td>
              <td style="padding: 10px 0;">${inquiry.budget}</td>
            </tr>` : ""}
          </table>

          <div style="background: #faf8f4; border-left: 3px solid #c9a96e; padding: 16px 20px; margin-bottom: 24px; font-family: sans-serif;">
            <p style="margin: 0 0 6px; font-size: 12px; color: #888; letter-spacing: 0.05em; text-transform: uppercase;">Message</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #2c2c2c;">${inquiry.message}</p>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.ADMIN_URL ?? "http://localhost/admin"}"
               style="display: inline-block; background: #1a1a1a; color: #fff; text-decoration: none;
                      padding: 12px 32px; font-family: sans-serif; font-size: 12px;
                      letter-spacing: 0.1em; text-transform: uppercase;">
              View in Admin Dashboard
            </a>
          </div>

          <p style="margin-top: 32px; font-size: 11px; color: #bbb; text-align: center; font-family: sans-serif;">
            This notification was sent automatically by the Maison Intérieure website.
          </p>
        </div>
      `,
    });

    if (error) {
      logger.error({ error }, "Failed to send inquiry notification email");
    } else {
      logger.info({ emailId: data?.id }, "Inquiry notification email sent");
    }
  } catch (err) {
    logger.error({ err }, "Exception sending inquiry notification email");
  }
}
