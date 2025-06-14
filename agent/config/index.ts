import dotenv from 'dotenv';
dotenv.config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'; 