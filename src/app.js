import express from 'express';
import authRoutes from './routes/AuthRoutes.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api', authRoutes);  

export default app;