import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import User from '../../models/UserModel.js';
import jwt from 'jsonwebtoken';

describe('ProfileController', () => {
    let token;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST);
    });

    beforeEach(async () => {
        await User.deleteMany({});
        const user = await User.create({
            name: 'Profile User',
            email: 'profile@example.com',
            password: 'hashed'
        });
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('debería obtener el perfil del usuario', async () => {
        const res = await request(app)
            .get('/api/profiles/get')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('profile@example.com');
    });

    it('debería actualizar el perfil del usuario', async () => {
        const res = await request(app)
            .patch('/api/profiles/update')
            .set('Authorization', `Bearer ${token}`)
            .attach('photo', Buffer.from(''), 'photo.jpg')
            .field('name', 'Nombre Actualizado');
        expect(res.statusCode).toBe(200);
        expect(res.body.user.name).toBe('Nombre Actualizado');
    });
})