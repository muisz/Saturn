const { initialize } = require('../../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
let server = null;

beforeEach(async () => {
    server = await initialize();
});

afterEach(async () => {
    await prisma.seller.deleteMany({});
    server.stop();
});

describe('POST /sellers/register', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };

    let response = null;

    beforeEach(async () => {
        response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
        });
    });

    test('Should return code 201 and success status', () => {
        expect(response.statusCode).toEqual(201);
        expect(response.result).toHaveProperty('status');
        expect(response.result.status).toEqual('success');
    });

    test('Should return seller data with access token', () => {
        expect(response.result).toHaveProperty('data');
        expect(response.result.data).toHaveProperty('accessToken');
        expect(response.result.data).toHaveProperty('refreshToken');
    });

    test('Should return exact data', () => {
        expect(response.result).toHaveProperty('data');
        expect(response.result.data.name).toEqual(payload.name);
        expect(response.result.data.email).toEqual(payload.email);
        expect(response.result.data.phoneNumber).toEqual(payload.phoneNumber);
    });
});