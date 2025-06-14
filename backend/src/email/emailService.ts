import { z } from 'zod';

// Validación de configuración
const emailConfigSchema = z.object({
  RESEND_API_KEY: z.string().min(10, 'RESEND_API_KEY is required'),
  RESEND_FROM_EMAIL: z.string().email('RESEND_FROM_EMAIL must be a valid email'),
});

const emailConfig = emailConfigSchema.parse({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
});

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  tags?: Record<string, string>;
  replyTo?: string;
}

export class EmailService {
  private apiKey: string;
  private from: string;

  constructor(apiKey: string, from: string) {
    this.apiKey = apiKey;
    this.from = from;
  }

  /**
   * Envía un email usando Resend API
   */
  async sendEmail(params: SendEmailParams): Promise<{ success: boolean; message: string; id?: string }> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.from,
          to: params.to,
          subject: params.subject,
          html: params.html,
          text: params.text,
          tags: params.tags,
          reply_to: params.replyTo,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('[Email] Failed to send email:', data);
        return { success: false, message: data.error || 'Failed to send email' };
      }
      return { success: true, message: 'Email sent', id: data.id };
    } catch (err: any) {
      console.error('[Email] Error sending email:', err.message);
      return { success: false, message: err.message };
    }
  }

  // TODO: Implementar colas y reintentos para envíos fallidos
}

export const emailService = new EmailService(emailConfig.RESEND_API_KEY, emailConfig.RESEND_FROM_EMAIL); 