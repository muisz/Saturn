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

describe('POST /sellers/register [Success]', () => {
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

describe('POST /sellers/register [Failed: Email Already Exist]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    let response = null;

    beforeEach(async () => {
        await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
        });
        response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload: { ...payload, phoneNumber: '382932' },
        });
    });

    test('Should return code 400', () => {
        expect(response.statusCode).toEqual(400);
    });

    test('Have an error payload', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected error response', () => {
        expect(response.result.statusCode).toEqual(400);
        expect(response.result.error).toEqual('Bad Request');
        expect(response.result.message).toEqual('Email Already Exist');
    });
});

describe('POST /sellers/register [Failed: Phone Number Already Exist]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    let response = null;

    beforeEach(async () => {
        await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
        });
        response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload: { ...payload, email: 'abdulmuis@gmail.com' },
        });
    });

    test('Should return code 400', () => {
        expect(response.statusCode).toEqual(400);
    });

    test('Have an error payload', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected error response', () => {
        expect(response.result.statusCode).toEqual(400);
        expect(response.result.error).toEqual('Bad Request');
        expect(response.result.message).toEqual('Phone Number Already Exist');
    });
});

describe('POST /sellers/login [Success: With Email]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    let response = null;

    beforeEach(async () => {
        await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
        });
        response = await server.inject({
            method: 'POST',
            url: '/sellers/login',
            payload: { email: payload.email, password: payload.password },
        });
    });

    test('Should return code 200', () => {
        expect(response.statusCode).toEqual(200);
    });

    test('Have an access token & refresh token', () => {
        expect(response.result.data).toHaveProperty('accessToken');
        expect(response.result.data).toHaveProperty('refreshToken');
        expect(response.result.data.accessToken).not.toEqual('');
        expect(response.result.data.refreshToken).not.toEqual('');
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('status');
        expect(response.result).toHaveProperty('data');
        expect(response.result.data).toHaveProperty('id');
        expect(response.result.data).toHaveProperty('name');
        expect(response.result.data).toHaveProperty('email');
        expect(response.result.data).toHaveProperty('phoneNumber');
        expect(response.result.data).toHaveProperty('lastLogin');
        expect(response.result.data).toHaveProperty('dateCreated');
        expect(response.result.data).toHaveProperty('dateUpdated');
    });

    test('Should return exact user', () => {
        expect(response.result.data.name).toEqual(payload.name);
        expect(response.result.data.email).toEqual(payload.email);
        expect(response.result.data.phoneNumber).toEqual(payload.phoneNumber);
    });
});

describe('POST /sellers/login [Success: With Phone Number]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    let response = null;

    beforeEach(async () => {
        await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
        });
        response = await server.inject({
            method: 'POST',
            url: '/sellers/login',
            payload: { phoneNumber: payload.phoneNumber, password: payload.password },
        });
    });

    test('Should return code 200', () => {
        expect(response.statusCode).toEqual(200);
    });

    test('Have an access token & refresh token', () => {
        expect(response.result.data).toHaveProperty('accessToken');
        expect(response.result.data).toHaveProperty('refreshToken');
        expect(response.result.data.accessToken).not.toEqual('');
        expect(response.result.data.refreshToken).not.toEqual('');
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('status');
        expect(response.result).toHaveProperty('data');
        expect(response.result.data).toHaveProperty('id');
        expect(response.result.data).toHaveProperty('name');
        expect(response.result.data).toHaveProperty('email');
        expect(response.result.data).toHaveProperty('phoneNumber');
        expect(response.result.data).toHaveProperty('lastLogin');
        expect(response.result.data).toHaveProperty('dateCreated');
        expect(response.result.data).toHaveProperty('dateUpdated');
    });

    test('Should return exact user', () => {
        expect(response.result.data.name).toEqual(payload.name);
        expect(response.result.data.email).toEqual(payload.email);
        expect(response.result.data.phoneNumber).toEqual(payload.phoneNumber);
    });
});