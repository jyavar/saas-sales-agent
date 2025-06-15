// @vitest-environment node
// Carga automática de variables de entorno para tests
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env.test' }); 