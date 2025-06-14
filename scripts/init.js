#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

function copyEnv(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✔ Copiado ${src} → ${dest}`);
  }
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

(async () => {
  console.log('🚀 Inicializando plantilla SaaS Sales Agent...');
  copyEnv('.env.example', '.env.local');
  copyEnv('frontend/.env.local.example', 'frontend/.env.local');

  // Opcional: pedir input para variables
  const editEnv = await ask('¿Quieres editar variables .env.local ahora? (y/N): ');
  if (editEnv.toLowerCase() === 'y') {
    console.log('Abre .env.local y frontend/.env.local en tu editor para personalizar las claves.');
  }

  console.log('📦 Instalando dependencias...');
  execSync('pnpm install', { stdio: 'inherit' });

  console.log('🟢 Lanzando entorno de desarrollo...');
  execSync('pnpm -r dev', { stdio: 'inherit' });
})(); 