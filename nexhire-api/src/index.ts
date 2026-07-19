import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import jobsRoutes from './routes/jobs';
import applicationsRoutes from './routes/applications';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins: string[] = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(cors({ origin: allowedOrigins }));
console.log('Allowed origins:', allowedOrigins);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NexHire API is running smoothly.' });
});

const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 NexHire API running on port ${PORT}`);
  });
};

startServer();