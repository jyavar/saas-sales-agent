export default class OpenAI {
  constructor() {}
  chat = {
    completions: {
      create: async () => ({
        choices: [{ message: { content: JSON.stringify({
          subject: '🚀 Novedades en tu stack: TypeScript, Node.js, Zod',
          body: 'Descubre oportunidades: Automatización de campañas, Integración CI/CD',
          cta: 'Solicita una demo personalizada',
          segment: 'developers'
        }) } }]
      })
    }
  };
  completions = {
    create: async () => ({ choices: [{ text: 'Texto mockeado' }] })
  };
  embeddings = {
    create: async () => ({ data: [{ embedding: [0, 1, 2] }] })
  };
} 