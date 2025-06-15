export const logger: {
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
};
export function logError(...args: any[]): void;
export function logRequest(...args: any[]): void; 