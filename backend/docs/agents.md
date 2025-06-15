# Agentes IA Personalizables — StratoSalesAgent

## ¿Qué es un perfil de agente?
Un perfil define la personalidad, instrucciones (prompt), memoria y configuración base de un agente.

Se definen en `backend/src/ai/agents/config.ts` usando el método `getAgentConfig(agentId)`.

## Estructura de un perfil
```ts
type AgentConfig = {
  prompt: string;
  persona: {
    name: string;
    role: string;
    tone: string;
  };
  memory?: any[];
};
```

## Ejemplo de definición
```ts
const AGENTS: Record<string, AgentConfig> = {
  sales: {
    prompt: `Eres un agente de IA que ayuda a empresas a generar campañas personalizadas. Eres estratégico, directo y creativo.`,
    persona: {
      name: 'SalesCopilot',
      role: 'Agente de campañas comerciales',
      tone: 'profesional y directo',
    },
    memory: [],
  },
  support: {
    prompt: `Eres un agente de soporte técnico, empático y resolutivo. Ayudas a usuarios a resolver incidencias rápidamente.`,
    persona: {
      name: 'SupportBot',
      role: 'Agente de soporte',
      tone: 'amable y resolutivo',
    },
    memory: [],
  },
};
```

## ¿Cómo añadir un nuevo perfil?
1. Abre `backend/src/ai/agents/config.ts`.
2. Añade una nueva entrada al objeto `AGENTS` con un `id` único (ej: `onboarding`).
3. Define el `prompt`, la `persona` y (opcional) la memoria inicial.
4. El nuevo perfil estará disponible usando `agentId` en la API (`/orchestrate`).

## Ejemplo de uso en API
```json
{
  "userId": "user_123",
  "eventType": "CAMPAIGN_STARTED",
  "agentId": "support"
}
```

Esto activará el agente de soporte definido en tu configuración.

---

**Tip:** Puedes crear tantos perfiles como necesites para ventas, soporte, onboarding, analítica, etc. ¡Haz tu copiloto IA realmente multi-agente! 