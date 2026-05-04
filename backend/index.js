import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import meetingsRouter from './routes/meetings.js';
import calendarRouter from './routes/calendar.js';
import processRouter from './routes/process.js';
import { startReminderScheduler } from './services/reminders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MeetMind API is running' });
});

app.use('/api/meetings', meetingsRouter);
app.use('/auth/google', calendarRouter);
app.use('/api/process', processRouter);

app.listen(PORT, () => {
  console.log(`✅ MeetMind API running on port ${PORT}`);
  startReminderScheduler();
});