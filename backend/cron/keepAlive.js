const cron = require('node-cron');

/**
 * Initialize Render free tier keep-alive ping job
 * Executes every 14 minutes to prevent Render free instance spin-down.
 */
const initKeepAliveJob = () => {
  const externalUrl = process.env.RENDER_EXTERNAL_URL;

  if (!externalUrl) {
    console.log('[Cron] RENDER_EXTERNAL_URL is not configured. Keep-alive ping is disabled.');
    return;
  }

  const targetUrl = `${externalUrl.replace(/\/$/, '')}/api/health`;
  console.log(`[Cron] Initializing keep-alive cron job scheduled for ${targetUrl} (every 14 mins).`);

  // Run every 14 minutes: '*/14 * * * *'
  cron.schedule('*/14 * * * *', async () => {
    try {
      console.log(`[Cron Keep-Alive] Pinging health check at: ${targetUrl}`);
      const response = await fetch(targetUrl);
      if (response.ok) {
        console.log(`[Cron Keep-Alive] Ping successful! Status: ${response.status}`);
      } else {
        console.warn(`[Cron Keep-Alive] Ping returned non-200 status: ${response.status}`);
      }
    } catch (err) {
      console.error(`[Cron Keep-Alive] Ping failed: ${err.message}`);
    }
  });
};

module.exports = {
  initKeepAliveJob
};
