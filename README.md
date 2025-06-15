# SaaS Sales Agent — Plantilla SaaS IA

Plantilla monorepo para crear productos SaaS con frontend Next.js, backend Node.js ESM, Supabase, OpenAI y un agente orquestador modular.

## 🚀 Introducción
Esta plantilla permite lanzar SaaS multi-agente con autenticación, persistencia, IA y trazabilidad lista para producción.

## 📦 Requisitos
- Node.js >= 18
- pnpm >= 8
- Cuenta en Supabase y OpenAI

## 🛠 Instalación
1. Clona el repositorio:
   ```sh
   git clone <REPO_URL> my-saas
   cd my-saas
   ```
2. Copia y edita las variables de entorno:
   ```sh
   cp .env.example .env.local
   cp frontend/.env.local.example frontend/.env.local
   # Edita los valores según tu entorno
   ```
3. Instala dependencias:
   ```sh
   pnpm install
   ```
4. Corre en local:
   ```sh
   pnpm -r dev
   ```

## 📜 Scripts disponibles
- `pnpm -r dev` — Levanta frontend y backend en modo desarrollo
- `pnpm -r build` — Compila ambos proyectos
- `pnpm -r test` — Ejecuta los tests
- `node scripts/init.js` — Inicializa entorno y lanza el proyecto

## 🚀 Características
- **Frontend:** Next.js 14, NextAuth, Tailwind, hooks AI, feed de actividad.
- **Backend:** Node.js ESM, Supabase, OpenAI, endpoints REST, logging, Zod.
- **Orquestador AI:** Modular, multi-evento, logging, validación, test E2E.
- **Infraestructura:** pnpm workspaces, scripts de setup, documentación Swagger UI.

## 🧪 Test
```sh
pnpm -r test
```

## ☁️ Deploy
- **Frontend:** Vercel (importa el repo, configura variables desde `.env.local.example`)
- **Backend:** Railway, Render o VPS (usa `.env.example`)

## 🧬 Clonar como plantilla
1. Clona este repo y cambia el nombre del proyecto.
2. Actualiza branding, variables y endpoints.
3. Usa el script de inicialización:
   ```sh
   node scripts/init.js
   ```

## 🧠 Agentes IA Personalizables

StratoSalesAgent permite definir múltiples perfiles de agente IA (ventas, soporte, onboarding, etc.) de forma modular y extensible.

- Cada perfil tiene su propio prompt, personalidad y memoria.
- El endpoint `/api/agent/orchestrate` acepta un campo `agentId` para seleccionar el perfil.
- Ejemplo de uso:

```json
{
  "userId": "user_123",
  "eventType": "CAMPAIGN_STARTED",
  "agentId": "support"
}
```

Esto activa el agente de soporte definido en `backend/src/ai/agents/config.ts`.

Consulta la [documentación detallada de agentes IA](backend/docs/agents.md) para aprender a crear y personalizar perfiles.

---

> Esta plantilla es la base para SaaS con IA conversacional y backend modular multi-agente. 