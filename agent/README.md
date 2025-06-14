# Strato AI Agent

Este módulo ejecuta acciones automatizadas con IA.

---

## ✅ Validación con Zod

Cada paso del agente utiliza esquemas Zod para validar:
- **Entrada**: Antes de procesar datos.
- **Salida**: Antes de pasar datos al siguiente módulo o enviarlos al backend.
- **Datos intermedios**: Para asegurar integridad en todo el flujo.

### Ejemplo de entrada al análisis:
```json
{
  "repoName": "growth-saas",
  "readmeContent": "# AI SaaS\n## Features\n- Lead generation\n- Automated outreach"
}
```

---

## 🧪 Ejemplo de test unitario con Zod

```ts
import { analyzeRepo } from '../analyzer';
import { repoAnalysisInputSchema, repoAnalysisOutputSchema } from '../types';

describe('analyzeRepo', () => {
  it('debe devolver una estructura válida para un repo simulado', async () => {
    const input = repoAnalysisInputSchema.parse({
      repoName: 'test-repo',
      readmeContent: '# Título\nDescripción\n## Features\n- AI\n- SaaS',
    });

    const result = await analyzeRepo(input);
    const parsed = repoAnalysisOutputSchema.parse(result);

    expect(parsed.summary).toBeDefined();
    expect(parsed.topics.length).toBeGreaterThan(0);
  });
});
```

---

## ⚙️ Fragmento CI/CD para correr tests (GitHub Actions)

```yaml
# .github/workflows/test-agent.yml
name: Test Agent

on:
  push:
    paths:
      - 'agent/**'
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm test
```

---

## 🚀 Integración E2E: runAgentForCampaign

La función principal para integración backend → agente es:

```ts
import { runAgentForCampaign } from './core/agentRunner'

const result = await runAgentForCampaign({
  campaignId: 'uuid',
  repoUrl: 'https://github.com/org/repo',
  tenantId: 'tenant-uuid',
  campaignName: 'Campaña X',
})
```

**Input:**
- `campaignId`: string
- `repoUrl`: string (URL del repo a analizar)
- `tenantId`: string
- `campaignName`: string

**Output:**
- `{ success, campaignId, analysis, generated, error? }`

Valida con Zod y loguea con Pino. Ideal para ser llamado desde el backend tras crear una campaña.

--- 