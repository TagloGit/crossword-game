import express, { json } from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(json());

app.use('/api/auth', authRoutes);

export default app;
