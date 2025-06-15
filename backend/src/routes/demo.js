import express from 'express';
const router = express.Router();

// Simulación de seed de datos demo
router.post('/seed', async (req, res) => {
  try {
    // Aquí deberías insertar datos demo en la DB real (Supabase, etc.)
    // Simulación:
    const demo = {
      campaigns: [
        { id: 1, name: 'Demo Campaign', description: 'Campaña de ejemplo', status: 'active' },
      ],
      leads: [
        { id: 1, name: 'Demo Lead', email: 'demo@lead.com', status: 'new' },
      ],
      users: [
        { id: 1, email: 'demo@user.com', role: 'admin' },
      ],
    };
    // Simula delay
    await new Promise(r => setTimeout(r, 800));
    res.status(200).json({ success: true, demo });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error al poblar datos demo' });
  }
});

export default router; 