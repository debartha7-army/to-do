import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  let supabaseStatus = 'disconnected';
  if (supabase) {
    try {
      const { error } = await supabase.from('discoveries').select('id').limit(1);
      supabaseStatus = error ? `error: ${error.message}` : 'connected';
    } catch (e) {
      supabaseStatus = `error: ${e.message}`;
    }
  }

  const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return res.json({
    status: 'ok',
    service: 'Orbit Notes — Personal Observatory API',
    version: '1.0.0',
    currentTime: {
      utc: new Date().toISOString(),
      ist: istTime
    },
    uptime: process.uptime(),
    database: {
      provider: 'Supabase Postgres',
      status: supabaseStatus
    },
    rssScheduler: {
      active: true,
      schedule: 'Daily at 08:00 AM IST (Asia/Kolkata)',
      feeds: ['NASA / JPL', 'NASA Science', 'ESA Space Science', 'ESA General News']
    }
  });
});

export default router;
