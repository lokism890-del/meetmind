import express from 'express';
import { google } from 'googleapis';
import supabase from '../supabase.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize the Google OAuth Client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.VITE_API_URL || 'http://localhost:3001'}/auth/google/callback`
);

// 1. Triggered when the user clicks "Connect Calendar"
router.get('/connect', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).send('User ID is required');

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/calendar.readonly', 
      'https://www.googleapis.com/auth/calendar.events'
    ],
    state: userId // Pass the userId so we remember who they are when Google sends them back
  });

  res.redirect(url);
});

// 2. Triggered when Google sends the user back to your app
router.get('/callback', async (req, res) => {
  const { code, state: userId } = req.query;

  try {
    // Exchange the code for actual access tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // THE FIX: Use UPSERT instead of INSERT to prevent the "duplicate key" error!
    const { error } = await supabase
      .from('user_calendars')
      .upsert({
        user_id: userId,
        google_token: tokens, 
      }, { 
        onConflict: 'user_id' // If this user_id already exists, just update their token!
      });

    if (error) {
      console.error('Calendar callback error:', error);
      return res.status(500).send('Failed to save calendar connection');
    }

    // Send the user back to the React dashboard with a success parameter
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/dashboard?calendar=connected`);
    
  } catch (error) {
    console.error('Error in Google callback:', error);
    res.status(500).send('Authentication failed');
  }
});

export default router;