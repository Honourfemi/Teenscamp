import { Resend } from 'resend';
import { CAMP_CONFIG } from './campConfig';

export async function sendConfirmationEmail({
  to,
  name,
  registrationId,
  platoon,
  qrDataUrl,
}: {
  to: string;
  name: string;
  registrationId: string;
  platoon: string;
  qrDataUrl: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const base64 = qrDataUrl.split(',')[1];

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Teens Camp <onboarding@resend.dev>',
    to,
    subject: `You're Registered! - ${CAMP_CONFIG.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color:#222;">
        <h1 style="color:#6B2D5C;">🏕️ ${CAMP_CONFIG.name}</h1>
        <p>Hi ${name},</p>
        <p>Your payment was successful and your registration is confirmed!</p>
        <p><strong>Registration ID:</strong> ${registrationId}</p>
        <p><strong>Platoon:</strong> ${platoon}</p>
        <p>Your QR code is attached to this email. Please bring it (printed or saved on your phone) on the first day of camp for check-in.</p>
        <hr style="margin:24px 0;" />
        <p><strong>Theme:</strong> "${CAMP_CONFIG.theme}"</p>
        <p><strong>Camp Date:</strong> ${CAMP_CONFIG.dateDisplay}</p>
        <p><strong>Venue:</strong> ${CAMP_CONFIG.venue}</p>
        <p><strong>Organized by:</strong> ${CAMP_CONFIG.church}</p>
        <hr style="margin:24px 0;" />
        <p>See you at camp!</p>
      </div>
    `,
    attachments: [
      {
        filename: 'qrcode.png',
        content: base64,
      },
    ],
  });
}
