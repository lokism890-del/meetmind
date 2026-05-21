import express from 'express';
import { google } from 'googleapis';
import { supabase } from '../supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'https://meetmind-backend-production.up.railway.app/api/calendar/callback'
);

// GET /api/calendar/auth-url
router.get('/auth-url', (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ error: 'Google OAuth credentials not configured' });
    }

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.readonly'
      ]
    });

    res.json({ url: authUrl });
  } catch (err) {
    console.error('Generate auth URL error:', err);
    res.status(500).json({ error: 'Failed to generate auth URL', details: err.message });
  }
});

// GET /api/calendar/callback (Google redirects here)
router.get('/callback', async (req, res) => {
  try {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`https://meetmind-two.vercel.app/connect-calendar?error=${error}`);
    }

    if (!code) {
      return res.redirect('https://meetmind-two.vercel.app/connect-calendar?error=no_code');
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Store in session/cookie temporarily so frontend can retrieve
    res.redirect(`https://meetmind-two.vercel.app/connect-calendar?code=${encodeURIComponent(code)}&success=true`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.redirect(`https://meetmind-two.vercel.app/connect-calendar?error=auth_failed`);
  }
});

// POST /api/calendar/callback (Frontend sends code here)
router.post('/callback', requireAuth, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Store tokens in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token || null,
        calendar_connected: true,
        calendar_connected_at: new Date()
      })
      .eq('id', req.userId);

    if (updateError) {
      console.error('Update user error:', updateError);
      return res.status(500).json({ error: 'Failed to save calendar connection' });
    }

    res.json({ success: true, message: 'Calendar connected successfully!' });
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).json({ error: 'Failed to connect calendar', details: err.message });
  }
});

// GET /api/calendar/check-connection
router.get('/check-connection', requireAuth, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('calendar_connected, google_access_token')
      .eq('id', req.userId)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to check connection' });
    }

    res.json({
      connected: user?.calendar_connected || false,
      hasToken: !!user?.google_access_token
    });
  } catch (err) {
    console.error('Check connection error:', err);
    res.status(500).json({ error: 'Failed to check connection' });
  }
});

// GET /api/calendar/upcoming-meetings
router.get('/upcoming-meetings', requireAuth, async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('google_access_token, calendar_connected')
      .eq('id', req.userId)
      .single();

    if (userError || !user?.calendar_connected || !user?.google_access_token) {
      return res.status(401).json({ error: 'Calendar not connected' });
    }

    oauth2Client.setCredentials({ access_token: user.google_access_token });

    const calendar = google.calendar('v3');
    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    });

    res.json({ meetings: response.data.items || [] });
  } catch (err) {
    console.error('Fetch meetings error:', err);
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// POST /api/calendar/disconnect
router.post('/disconnect', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        google_access_token: null,
        google_refresh_token: null,
        calendar_connected: false,
        calendar_connected_at: null
      })
      .eq('id', req.userId);

    if (error) return res.status(500).json({ error: 'Failed to disconnect' });

    res.json({ success: true, message: 'Calendar disconnected' });
  } catch (err) {
    console.error('Disconnect error:', err);
    res.status(500).json({ error: 'Failed to disconnect calendar' });
  }
});

export default router;