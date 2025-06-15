# Añadir nuevos Prompts y Presets IA

Para agregar un nuevo prompt IA:

1. Crea un archivo en `agent/config/prompts/` (ejemplo: `support.ts`).
2. Exporta un objeto con la estructura del prompt:
   ```ts
   export const supportPrompt = {
     system: '...', // Instrucción para el agente
     user: '...',   // Prompt para el usuario
   };
   ```
3. En `agent/config/presets.ts`, importa el prompt y añade un nuevo preset:
   ```ts
   import { supportPrompt } from './prompts/support';
   export const presets = {
     ...,
     support: {
       prompt: supportPrompt,
       description: 'Soporte al cliente',
       ... // Config extra
     },
   };
   ```
4. Usa el `presetKey` correspondiente al crear campañas para seleccionar el prompt dinámicamente. 