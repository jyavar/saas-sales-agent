// Entry point del Agente Strato AI 
import { runAgentForRepo } from './core/agentRunner';
import { loadBatchInput } from './core/inputLoader';
import { logger } from './lib/logger';

async function main() {
  const inputs = await loadBatchInput(process.argv[2]);
  for (const [i, input] of inputs.entries()) {
    const log = logger.child({ repo: input.repoUrl, tenant: input.tenantId, batchIndex: i });
    log.info('⏳ Inicio de procesamiento de input');
    const start = performance.now?.() ?? Date.now();
    try {
      await runAgentForRepo(input, log);
      const elapsed = (performance.now?.() ?? Date.now()) - start;
      log.info({ elapsedMs: elapsed }, '✅ Procesamiento exitoso');
    } catch (err) {
      const elapsed = (performance.now?.() ?? Date.now()) - start;
      log.error({ err, elapsedMs: elapsed }, '❌ Error procesando repositorio');
    }
  }
}
main(); 