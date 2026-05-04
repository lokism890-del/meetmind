import express from 'express';
import supabase from '../supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET all meetings
router.get('/', requireAuth, async (req, res) => {
  try {
    console.log('Fetching meetings for user:', req.userId);
    
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Meetings found:', data?.length);
    res.json(data);
  } catch (err) {
    console.error('Route error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET single meeting
router.get('/:id', requireAuth, async (req, res) => {
  try {
    console.log('Fetching meeting:', req.params.id);
    
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Route error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST create meeting
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, start_time, meeting_url, attendees, platform } = req.body;
    console.log('Creating meeting:', title);

    const { data, error } = await supabase
      .from('meetings')
      .insert({
        user_id: req.userId,
        title,
        start_time,
        meeting_url,
        attendees,
        platform,
        status: 'upcoming'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Route error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH update meeting
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { status, summary, transcript, action_items, decisions, duration_minutes } = req.body;
    console.log('Updating meeting:', req.params.id);

    const { data, error } = await supabase
      .from('meetings')
      .update({ status, summary, transcript, action_items, decisions, duration_minutes })
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Route error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE meeting
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    console.log('Deleting meeting:', req.params.id);

    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Route error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST ask a question about a meeting
router.post('/:id/ask', requireAuth, async (req, res) => {
  try {
    const { question, transcript, summary } = req.body;
    console.log('Asking question about meeting:', req.params.id);

    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a helpful meeting assistant. Answer questions about this meeting based on the transcript and summary provided. Be concise and specific.
          
Summary: ${summary}

Transcript:
${transcript}`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    console.log('Answer generated successfully');
    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error('Ask error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;