import express from 'express';
import path from 'path';
import authRoutes from './routes/AuthRoutes.js';
import reportRoutes from './routes/ReportRoutes.js';
import profileRoutes from './routes/ProfileRoutes.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', authRoutes);

app.use('/api/reports', reportRoutes);

app.use('/api/profiles', profileRoutes);

export default app;