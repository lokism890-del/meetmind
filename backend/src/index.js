import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import meetingsRouter from './routes/meetings.js';
import calendarRouter from './routes/calendar.js';
import processRouter from './routes/process.js';
import { startReminderScheduler } from './services/reminders.js'; // ✅
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration - Allow frontend to make requests
app.use(cors({
  origin: ['https://meetmind-two.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MeetMind API is running' });
});

// Routes
app.use('/api/meetings', meetingsRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/process', processRouter);

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ MeetMind API running on port ${PORT}`);
  console.log(`📅 Calendar routes loaded at /api/calendar`);
  console.log(`📧 Meeting reminder scheduler started`);
  console.log(`🔗 Accepting requests from: https://meetmind-two.vercel.app`);
  
  // Start the meeting reminder scheduler
  startReminderScheduler();
});