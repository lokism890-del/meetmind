import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['https://meetmind-two.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MeetMind API is running' });
});

// Test calendar route directly here first
app.get('/api/calendar/auth-url', (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    console.log('Auth URL requested');
    console.log('Client ID exists:', !!clientId);
    console.log('Client Secret exists:', !!clientSecret);

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: 'Google OAuth not configured',
        clientId: !!clientId,
        clientSecret: !!clientSecret
      });
    }

    // Dynamic import to avoid startup crash
    import('googleapis').then(({ google }) => {
      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        process.env.GOOGLE_REDIRECT_URI || 'https://meetmind-backend-production.up.railway.app/api/calendar/callback'
      );

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/calendar.readonly'
        ]
      });

      console.log('Auth URL generated successfully');
      res.json({ url: authUrl });
    }).catch(err => {
      console.error('googleapis import error:', err);
      res.status(500).json({ error: 'Failed to load Google APIs', details: err.message });
    });
  } catch (err) {
    console.error('Auth URL error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Load other routes
async function loadRoutes() {
  try {
    const { default: meetingsRouter } = await import('./routes/meetings.js');
    app.use('/api/meetings', meetingsRouter);
    console.log('✅ Meetings routes loaded');
  } catch (err) {
    console.error('❌ Failed to load meetings routes:', err.message);
  }

  try {
    const { default: calendarRouter } = await import('./routes/calendar.js');
    app.use('/api/calendar', calendarRouter);
    console.log('✅ Calendar routes loaded');
  } catch (err) {
    console.error('❌ Failed to load calendar routes:', err.message);
  }

  try {
    const { default: processRouter } = await import('./routes/process.js');
    app.use('/api/process', processRouter);
    console.log('✅ Process routes loaded');
  } catch (err) {
    console.error('❌ Failed to load process routes:', err.message);
  }

  try {
    const { startReminderScheduler } = await import('./services/reminderService.js');
    startReminderScheduler();
    console.log('✅ Reminder scheduler started');
  } catch (err) {
    console.error('❌ Failed to start reminder scheduler:', err.message);
  }
}

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, async () => {
  console.log(`✅ MeetMind API running on port ${PORT}`);
  await loadRoutes();
});