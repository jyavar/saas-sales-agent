"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const required = [
    'OPENAI_API_KEY',
    'RESEND_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_KEY',
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
    console.error('❌ Faltan variables de entorno:', missing.join(', '));
    process.exit(1);
}
else {
    console.log('✅ Todas las variables de entorno críticas están presentes.');
}
