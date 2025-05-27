import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import User from '../../models/UserModel.js';
import Report from '../../models/ReportModel.js';
import jwt from 'jsonwebtoken';

describe('ReportController', () => {
    let token;
    let reportId;

    beforeAll(async () => {
        // Conectar y limpiar base de datos una sola vez
        await mongoose.connect(process.env.MONGO_URI_TEST);
        await Report.deleteMany({});
        await User.deleteMany({});

        // Crear usuario y token
        const user = await User.create({ name: 'Reporter', email: 'report@example.com', password: 'hashed' });
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('debería crear un nuevo reporte', async () => {
        const res = await request(app)
            .post('/api/reports/create')
            .set('Authorization', `Bearer ${token}`)
            .attach('photo', Buffer.from(''), 'photo.jpg')
            .field('petDetails', JSON.stringify({ breed: 'Mestizo', species: 'Perro', color: 'Negro' }))
            .field('petName', 'Firulais')
            .field('userContact', '1234567890')
            .field('lastSeenLocation', 'Parque Central')
            .field('description', 'Se perdió en la mañana');
        expect(res.statusCode).toBe(201);
        reportId = res.body.newReport._id;
    });

    it('debería obtener todos los reportes', async () => {
        const res = await request(app).get('/api/reports/getAllReports');
        expect(res.statusCode).toBe(200);
        expect(res.body.data.reports.length).toBeGreaterThanOrEqual(1);
    });

    it('debería finalizar un reporte', async () => {
        const res = await request(app)
            .patch('/api/reports/finishReport')
            .set('Authorization', `Bearer ${token}`)
            .send({ reportId });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.status).toBe('finished');
    });

    it('debería reportar como falso', async () => {
        const res = await request(app)
            .post(`/api/reports/reportAsfake/${reportId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ reason: 'No es real' });
        expect(res.statusCode).toBe(200);
    });
});
