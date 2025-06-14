import { RepoInput, RepoInputSchema } from '../types';
import fs from 'fs/promises';

/**
 * Carga un array de entradas desde un archivo JSON o stdin.
 * Si no se especifica archivo, lee de stdin.
 */
export async function loadBatchInput(filePath?: string): Promise<RepoInput[]> {
  let raw: string;
  if (filePath) {
    raw = await fs.readFile(filePath, 'utf8');
  } else {
    raw = await new Promise<string>((resolve) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', chunk => data += chunk);
      process.stdin.on('end', () => resolve(data));
    });
  }
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr)) throw new Error('El input debe ser un array de objetos');
  return arr.map((item, i) => {
    try {
      return RepoInputSchema.parse(item);
    } catch (e: any) {
      throw new Error(`Input inválido en posición ${i}: ${e}`);
    }
  });
} 