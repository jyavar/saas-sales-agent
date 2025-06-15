import fetch from 'node-fetch';
import pRetry from 'p-retry';
import { logger } from '../utils/common/logger.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API_URL = 'https://api.resend.com/emails';

if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

async function sendResendEmail(to: string, subject: string, body: string) {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@stratosales.com',
      to,
      subject,
      html: body,
    }),
  });
  const data: any = await response.json();
  if (!response.ok) {
    logger.error('Error sending email', { to, subject, data });
    throw new Error(data.error?.message || 'Error sending email with Resend');
  }
  logger.info('Email sent', { to, subject, resendId: data.id });
}

/**
 * Envía un email de campaña real usando Resend API con retry.
 * @param to - Email destino
 * @param subject - Asunto del email
 * @param body - Cuerpo HTML del email
 */
export async function sendCampaignEmail(to: string, subject: string, body: string): Promise<void> {
  try {
    await pRetry(() => sendResendEmail(to, subject, body), { retries: 3 });
  } catch (error: any) {
    logger.error('Failed to send email after retries', { to, subject, error: error.message });
    throw error;
  }
} 