import express from 'express';
import supabase from '../supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { transcribeAudio } from '../services/transcribe.js';
import { summarizeMeeting } from '../services/summarize.js';
import { sendMeetingSummary } from '../services/emailServices.js';  // ✅ CORRECT
const router = express.Router();

// POST /api/process — upload and process a meeting recording
router.post('/', requireAuth, async (req, res) => {
  try {
    const { audioUrl, meetingTitle, attendeeEmails } = req.body;

    if (!audioUrl) return res.status(400).json({ error: 'audioUrl is required' });

    // Create meeting record
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        user_id: req.userId,
        title: meetingTitle || 'Untitled Meeting',
        status: 'processing',
        attendees: attendeeEmails || [],
        platform: 'upload',
        start_time: new Date().toISOString()
      })
      .select()
      .single();

    if (meetingError) throw meetingError;

    // Return immediately, process in background
    res.json({ success: true, meetingId: meeting.id, status: 'processing' });

    // Background processing
    try {
      // Step 1: Transcribe
      console.log('Processing meeting:', meeting.id);
      const transcript = await transcribeAudio(audioUrl);

      // Step 2: Summarize
      const summary = await summarizeMeeting(transcript, meeting.title);

      // Step 3: Save to database
      await supabase
        .from('meetings')
        .update({
          status: 'done',
          transcript,
          summary: summary.summary,
          action_items: summary.action_items,
          decisions: summary.decisions,
        })
        .eq('id', meeting.id);

      console.log('Meeting saved to database');

      // Step 4: Send email
      if (attendeeEmails?.length > 0) {
        for (const email of attendeeEmails) {
          await sendMeetingSummary({
            to: email,
            meetingTitle: meeting.title,
            summary: summary.summary,
            decisions: summary.decisions,
            actionItems: summary.action_items,
            transcript
          });
        }
      }

      console.log('Meeting processing complete:', meeting.id);
    } catch (bgErr) {
      console.error('Background processing error:', bgErr);
      await supabase
        .from('meetings')
        .update({ status: 'error' })
        .eq('id', meeting.id);
    }
  } catch (err) {
    console.error('Process route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/process/:id — check processing status
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('id, status, title, summary, action_items, decisions')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;