import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function summarizeMeeting(transcript, meetingTitle) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is missing from environment variables.');
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a professional meeting assistant. Analyze the meeting transcript and provide:
1. A concise summary (2-3 sentences)
2. Key decisions made
3. Action items with owners if mentioned

Format your response as JSON with this structure:
{
  "summary": "brief summary here",
  "decisions": ["decision 1", "decision 2"],
  "action_items": ["action 1", "action 2"]
}`
        },
        {
          role: 'user',
          content: `Meeting Title: ${meetingTitle}\n\nTranscript: ${transcript}`
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;

    try {
      return JSON.parse(content);
    } catch {
      return {
        summary: content || 'No summary generated.',
        decisions: [],
        action_items: []
      };
    }
  } catch (error) {
    console.error('Summarization Error:', error.message);
    throw error;
  }
}