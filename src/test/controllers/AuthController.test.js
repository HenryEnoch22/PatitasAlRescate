import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import User from '../../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('AuthController', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST);
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
    };

    it('debería registrar un nuevo usuario', async () => {
        const res = await request(app)
            .post('/api/register')
            .send(testUser);
        expect(res.statusCode).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe(testUser.email);
    });

    it('debería hacer login con credenciales válidas', async () => {
        // registra con bcrypt
        const hashed = await bcrypt.hash(testUser.password, 10);
        await User.create({ name: testUser.name, email: testUser.email, password: hashed });
        const res = await request(app)
            .post('/api/login')
            .send({ email: testUser.email, password: testUser.password });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('debería rechazar login con contraseña incorrecta', async () => {
        const hashed = await bcrypt.hash(testUser.password, 10);
        await User.create({ name: testUser.name, email: testUser.email, password: hashed });
        const res = await request(app)
            .post('/api/login')
            .send({ email: testUser.email, password: 'wrongpass' });
        expect(res.statusCode).toBe(400);
    });
});