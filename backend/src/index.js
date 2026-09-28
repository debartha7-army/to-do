import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { initScheduler } from './services/scheduler.js';
import { checkSupabaseConnection } from './config/supabase.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`====================================================`);
  console.log(`🌌 Orbit Notes — Personal Observatory Backend`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`🕒 Server Time (IST): ${istTime}`);
  console.log(`====================================================`);

  // Initialize daily RSS feed sync scheduler
  initScheduler();

  // Test Supabase connection
  const dbOk = await checkSupabaseConnection();
  if (dbOk) {
    console.log(`✅ Supabase database connected successfully.`);
  } else {
    console.log(`ℹ️ Supabase not yet available or configured; running with responsive in-memory persistence.`);
  }
});

export default server;
