# Checklist de Producción - StratoSalesAgent

- [ ] Claves y secrets configurados en entorno seguro (.env, dashboard de hosting).
- [ ] Supabase conectado y autenticado.
- [ ] Logs de producción activos y revisados.
- [ ] Test E2E y cobertura >90% auditada.
- [ ] Endpoint `/health` responde 200 OK.
- [ ] Emails de prueba enviados y recibidos.
- [ ] Prompts y presets documentados.
- [ ] QA manual realizado y validado.

## 🚀 Despliegue rápido

1. Clona el repo y configura `.env` según [backend/docs/ENV.md](backend/docs/ENV.md)
2. Instala dependencias: `pnpm install`
3. Verifica entorno: `pnpm --filter backend run check-env`
4. Ejecuta tests: `pnpm vitest run --coverage`
5. Despliega a Railway/Vercel o tu plataforma preferida
6. Verifica `/health` y realiza QA manual 