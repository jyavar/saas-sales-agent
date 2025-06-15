#!/usr/bin/env node

/**
 * Rollback script for production deployment
 * Usage: node scripts/rollback.js production
 */

const { execSync } = require('child_process');

function rollbackProd() {
  try {
    console.log('⏪ Starting production rollback...');
    // Restaurar backup más reciente (ajusta según tu estrategia de backup)
    execSync('node scripts/restore-backup.js latest', { stdio: 'inherit' });
    console.log('✅ Rollback completed.');
  } catch (err) {
    console.error('❌ Rollback failed:', err.message);
    process.exit(1);
  }
}

const env = process.argv[2];
if (env === 'production') {
  rollbackProd();
} else {
  console.log('Usage: node scripts/rollback.js production');
  process.exit(1);
} 