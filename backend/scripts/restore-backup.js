#!/usr/bin/env node

/**
 * Restore Supabase backup
 * Usage: node scripts/restore-backup.js <backup_id|latest>
 */

const { execSync } = require('child_process');

function restoreBackup(backupId) {
  try {
    console.log(`🔄 Restoring backup: ${backupId}`);
    // Comando de restauración (ajusta según tu proveedor)
    execSync(`supabase db restore ${backupId}`, { stdio: 'inherit' });
    console.log('✅ Backup restored.');
  } catch (err) {
    console.error('❌ Restore failed:', err.message);
    process.exit(1);
  }
}

const backupId = process.argv[2];
if (!backupId) {
  console.log('Usage: node scripts/restore-backup.js <backup_id|latest>');
  process.exit(1);
}
restoreBackup(backupId); 