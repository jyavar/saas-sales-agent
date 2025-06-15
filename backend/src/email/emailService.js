"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailService = void 0;
const zod_1 = require("zod");
// Validación de configuración
const emailConfigSchema = zod_1.z.object({
    RESEND_API_KEY: zod_1.z.string().min(10, 'RESEND_API_KEY is required'),
    RESEND_FROM_EMAIL: zod_1.z.string().email('RESEND_FROM_EMAIL must be a valid email'),
});
const emailConfig = emailConfigSchema.parse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
});
class EmailService {
    constructor(apiKey, from) {
        this.apiKey = apiKey;
        this.from = from;
    }
    /**
     * Envía un email usando Resend API
     */
    sendEmail(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('https://api.resend.com/emails', {
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
                const data = yield response.json();
                if (!response.ok) {
                    console.error('[Email] Failed to send email:', data);
                    return { success: false, message: data.error || 'Failed to send email' };
                }
                return { success: true, message: 'Email sent', id: data.id };
            }
            catch (err) {
                console.error('[Email] Error sending email:', err.message);
                return { success: false, message: err.message };
            }
        });
    }
}
exports.EmailService = EmailService;
exports.emailService = new EmailService(emailConfig.RESEND_API_KEY, emailConfig.RESEND_FROM_EMAIL);
