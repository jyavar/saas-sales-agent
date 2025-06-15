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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCampaignEmail = sendCampaignEmail;
const node_fetch_1 = __importDefault(require("node-fetch"));
const p_retry_1 = __importDefault(require("p-retry"));
const logger_js_1 = require("../utils/common/logger.js");
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API_URL = 'https://api.resend.com/emails';
if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set in environment variables');
}
function sendResendEmail(to, subject, body) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const response = yield (0, node_fetch_1.default)(RESEND_API_URL, {
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
        const data = yield response.json();
        if (!response.ok) {
            logger_js_1.logger.error('Error sending email', { to, subject, data });
            throw new Error(((_a = data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error sending email with Resend');
        }
        logger_js_1.logger.info('Email sent', { to, subject, resendId: data.id });
    });
}
/**
 * Envía un email de campaña real usando Resend API con retry.
 * @param to - Email destino
 * @param subject - Asunto del email
 * @param body - Cuerpo HTML del email
 */
function sendCampaignEmail(to, subject, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, p_retry_1.default)(() => sendResendEmail(to, subject, body), { retries: 3 });
        }
        catch (error) {
            logger_js_1.logger.error('Failed to send email after retries', { to, subject, error: error.message });
            throw error;
        }
    });
}
