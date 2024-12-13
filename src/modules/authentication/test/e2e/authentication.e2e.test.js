import request from 'supertest';
import app from '../../../../index.js';

describe('E2E: Authentication API', () => {
    it('Login correcto', async () => {
        const response = await request(app)
            .post('/api/v1/authentication/password')
            .send({ user: 'test', pass: '123' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Inicio de sesión correcto');
        expect(response.body.data).toHaveProperty('token');
    });

    it('Login incorrecto', async () => {
        const response = await request(app)
            .post('/api/v1/authentication/password')
            .send({ user: 'test', pass: 'wrong' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Usuario no autorizado');
    });
});