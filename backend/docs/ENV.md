# Variables de Entorno - StratoSalesAgent

- `OPENAI_API_KEY`: Clave de API de OpenAI para generación IA.
- `RESEND_API_KEY`: Clave de API de Resend para envío de emails.
- `SUPABASE_URL` y `SUPABASE_KEY`: Conexión a la base de datos Supabase.
- `LOG_LEVEL`: Nivel de logs (info, warn, error, debug).

Configura estas claves en `.env` local y en el entorno de producción (Vercel, Railway, etc). Nunca subas `.env` al repositorio. 