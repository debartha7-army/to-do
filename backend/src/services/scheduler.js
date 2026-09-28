import cron from 'node-cron';
import { syncOfficialRssFeeds } from './rssCollector.js';

export const initScheduler = () => {
  // Daily 8:00 AM India Standard Time (IST - Asia/Kolkata)
  // Cron expression: minute 0, hour 8, every day, month, weekday
  const cronExpression = '0 8 * * *';

  console.log('[Scheduler] Scheduling daily RSS feed collection at 08:00 AM IST (Asia/Kolkata)');

  const task = cron.schedule(cronExpression, async () => {
    const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    console.log(`[Scheduler] ⏰ Triggering scheduled daily 8:00 AM IST sync (Current IST: ${istTime})`);
    try {
      const result = await syncOfficialRssFeeds();
      console.log(`[Scheduler] Scheduled RSS sync complete:`, result);
    } catch (err) {
      console.error('[Scheduler] Error in scheduled RSS collector:', err);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Kolkata'
  });

  return task;
};
