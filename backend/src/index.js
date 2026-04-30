import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import meetingsRouter from './routes/meetings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Fix CORS - allow all origins for now
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

app.listen(PORT, () => {
  console.log(`✅ MeetMind API running on port ${PORT}`);
});