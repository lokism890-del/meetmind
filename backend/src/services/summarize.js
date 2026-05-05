import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Groq } from 'groq-sdk';

// Manually resolve the path to the .env file to avoid ES Module loading issues
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Generates a summary of the meeting transcript using AI.
 * @param {string} transcript - The raw text from the meeting.
 * @param {string} meetingTitle - The name of the meeting for context.
 */
export async function summarizeMeeting(transcript, meetingTitle) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing from environment variables.");
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional assistant. Summarize the following meeting transcript into clear bullet points with key takeaways and action items."
        },
        { 
          role: "user", 
          content: `Meeting Title: ${meetingTitle}\n\nTranscript: ${transcript}` 
        }
      ],
      model: "mixtral-8x7b-32768", // Using Mixtral for high-quality technical summaries
      temperature: 0.5,
    });

    return completion.choices[0]?.message?.content || "No summary generated.";
  } catch (error) {
    console.error("❌ Summarization Error:", error.message);
    throw error;
  }
}