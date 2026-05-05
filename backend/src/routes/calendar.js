import express from 'express';
import { google } from 'googleapis';
import { supabase } from '../supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate Google auth URL
router.get('/auth-url', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]
  });
  
  res.json({ url: authUrl });
});

// Handle OAuth callback
router.post('/callback', requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in database
    await supabase
      .from('users')
      .update({
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
        calendar_connected: true
      })
      .eq('id', req.userId);
    
    res.json({ success: true, message: 'Calendar connected!' });
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).json({ error: 'Failed to connect calendar' });
  }
});

// Get upcoming meetings
router.get('/upcoming-meetings', requireAuth, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('google_access_token')
      .eq('id', req.userId)
      .single();
    
    if (!user?.google_access_token) {
      return res.status(401).json({ error: 'Calendar not connected' });
    }
    
    oauth2Client.setCredentials({
      access_token: user.google_access_token
    });
    
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

export default router;