import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import User from '../../models/UserModel.js';
import Comment from '../../models/CommentModel.js';
import jwt from 'jsonwebtoken';

describe('CommentController', () => {
    let token;
    let reportId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST);
    });

    beforeEach(async () => {
        await Comment.deleteMany({});
        await User.deleteMany({});
        const user = await User.create({ name: 'CUser', email: 'comment@example.com', password: 'hashed' });
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        reportId = new mongoose.Types.ObjectId().toString();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('debería crear un comentario', async () => {
        const res = await request(app)
            .post('/api/comments/create')
            .set('Authorization', `Bearer ${token}`)
            .send({ reportId, text: 'Comentario de prueba' });
        expect(res.statusCode).toBe(201);
        expect(res.body.data.text).toBe('Comentario de prueba');
    });

    it('debería obtener comentarios por reportId', async () => {
        await request(app)
            .post('/api/comments/create')
            .set('Authorization', `Bearer ${token}`)
            .send({ reportId, text: 'Otro comentario' });
        const res = await request(app)
            .get(`/api/comments/${reportId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('debería actualizar un comentario', async () => {
        const createRes = await request(app)
            .post('/api/comments/create')
            .set('Authorization', `Bearer ${token}`)
            .send({ reportId, text: 'Inicial' });
        const id = createRes.body.data._id;
        const res = await request(app)
            .patch(`/api/comments/update/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Editado' });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.text).toBe('Editado');
    });

    it('debería eliminar un comentario', async () => {
        const createRes = await request(app)
            .post('/api/comments/create')
            .set('Authorization', `Bearer ${token}`)
            .send({ reportId, text: 'Para borrar' });
        const id = createRes.body.data._id;
        const res = await request(app)
            .delete(`/api/comments/delete/${id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });
});