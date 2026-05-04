import 'dotenv/config';
import { Groq } from 'groq-sdk';
// rest of your code...
// import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function summarizeMeeting(transcript, meetingTitle) {
  console.log('Summarizing meeting with Groq:', meetingTitle);

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are an expert meeting summarizer. Analyze this meeting transcript and extract the key information.

Meeting Title: ${meetingTitle}

Transcript:
${transcript}

Please provide a JSON response with exactly this structure:
{
  "summary": "2-3 sentence overview of the meeting",
  "decisions": ["decision 1", "decision 2"],
  "action_items": [
    {"owner": "Person name", "task": "what they need to do", "due": "timeframe if mentioned"}
  ],
  "key_topics": ["topic 1", "topic 2", "topic 3"]
}

Return ONLY the JSON, no other text, no markdown backticks.`
      }
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const text = completion.choices[0].message.content;
  console.log('Groq response received');

  try {
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    console.log('Summary generated successfully');
    return parsed;
  } catch (err) {
    console.error('Failed to parse summary JSON:', err);
    return {
      summary: text,
      decisions: [],
      action_items: [],
      key_topics: []
    };
  }
}