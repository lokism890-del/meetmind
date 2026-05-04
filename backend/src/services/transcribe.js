import { AssemblyAI } from 'assemblyai';
import dotenv from 'dotenv';
dotenv.config();

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

export async function transcribeAudio(audioUrl) {
  console.log('Starting transcription for:', audioUrl);
  
  const transcript = await client.transcripts.transcribe({
    audio_url: audioUrl,
    speech_models: ['universal-3-pro'],
    speaker_labels: true,
  });

  if (transcript.status === 'error') {
    throw new Error(`Transcription failed: ${transcript.error}`);
  }

  const formatted = transcript.utterances
    ? transcript.utterances.map(u => `Speaker ${u.speaker}: ${u.text}`).join('\n')
    : transcript.text;

  console.log('Transcription complete, length:', formatted.length);
  return formatted;
}