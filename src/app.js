import express from 'express';
import authRoutes from './routes/AuthRoutes.js';
import reportRoutes from './routes/ReportRoutes.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api', authRoutes);
app.use('/api', reportRoutes);

export default app;