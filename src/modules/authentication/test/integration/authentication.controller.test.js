import request from 'supertest';

const serverUrl = 'http://localhost:3000';

describe('POST /api/v1/authentication/password (Integration)', () => {

    it('Parametro de usuario no puede estar vacio', async () => {
        const response = await request(serverUrl)
            .post('/api/v1/authentication/password')
            .send({ user: '', pass: '123' });
        expect(response.status).toBe(400);
    });

    it('Parametro de password no puede estar vacio', async () => {
        const response = await request(serverUrl)
            .post('/api/v1/authentication/password')
            .send({ user: 'user', pass: '' });
        expect(response.status).toBe(400);
    });

    it('Parametros correctos', async () => {
        const response = await request(serverUrl)
            .post('/api/v1/authentication/password')
            .send({ user: 'test', pass: '123' });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('refreshToken');
        expect(response.body.data).toHaveProperty('accessToken');

    });

    it('Usuario eliminado', async () => {
        const response = await request(serverUrl)
            .post('/api/v1/authentication/password')
            .send({ user: 'deleted_user', pass: '123' });
        expect(response.status).toBe(404);
    });

    it('Usuario no existe', async () => {
        const response = await request(serverUrl)
            .post('/api/v1/authentication/password')
            .send({ user: 'inexistente', pass: '123' });
        expect(response.status).toBe(404);

    });

    it('Password incorrecto', async () => {
        const response = await request(serverUrl)
            .post('/api/v1/authentication/password')
            .send({ user: 'test', pass: 'wrong' });
        expect(response.status).toBe(401);
    });

});

describe('GET /api/v1/authentication/logout (Integration)', () => {

    let refreshToken;
    let accessToken;

    beforeAll(async () => {

        const response = await request(serverUrl)
            .post('/api/v1/authentication/password')
            .send({ user: 'test', pass: '123' });

        refreshToken = response.body.data.refreshToken;
        accessToken = response.body.data.accessToken;
    });

    it('Cerrar sesion', async () => {

        const response = await request(serverUrl)
            .get('/api/v1/authentication/logout')
            .set('Authorization', 'Bearer ' + accessToken);
        expect(response.status).toBe(200);

    });

    it('Cerrar todas las sesiones', async () => {

        const response = await request(serverUrl)
            .get('/api/v1/authentication/logout')
            .set('Authorization', 'Bearer ' + refreshToken);

        expect(response.status).toBe(200);

    });

});

describe('GET /api/v1/authentication/renew (Integration)', () => {

    let refreshToken;

    beforeAll(async () => {

        const response = await request(serverUrl)
            .post('/api/v1/authentication/password')
            .send({ user: 'test', pass: '123' });

        refreshToken = response.body.data.refreshToken;

    });

    it('Renovar token', async () => {

        const response = await request(serverUrl)
            .get('/api/v1/authentication/renew')
            .set('Authorization', `Bearer ${refreshToken}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('refreshToken');
        expect(response.body.data).toHaveProperty('accessToken');

    });

});