const { initialize } = require('../../server');
const { PrismaClient } = require('@prisma/client');
const tokenHelpers = require('../../helpers/token');
const tokenConstant = require('../../constants/token');

const prisma = new PrismaClient();
const headers = {
    'x-api-key': 'testingapi',
};
let server = null;

beforeEach(async () => {
    server = await initialize();
});

afterEach(async () => {
    await prisma.seller.deleteMany({});
    await prisma.token.deleteMany({});
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
            headers,
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
            headers,
        });
        response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload: { ...payload, phoneNumber: '382932' },
            headers,
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
            headers,
        });
        response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload: { ...payload, email: 'abdulmuis@gmail.com' },
            headers,
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
            headers,
        });
        response = await server.inject({
            method: 'POST',
            url: '/sellers/login',
            payload: { email: payload.email, password: payload.password },
            headers,
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
            headers,
        });
        response = await server.inject({
            method: 'POST',
            url: '/sellers/login',
            payload: { phoneNumber: payload.phoneNumber, password: payload.password },
            headers,
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

describe('GET /sellers/{id} [Success]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    let response = null;

    beforeEach(async () => {
        const user_response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
            headers,
        });
        response = await server.inject({
            method: 'GET',
            url: `/sellers/${user_response.result.data.id}`,
            headers,
        });
    });

    test('Should return 200', () => {
        expect(response.statusCode).toEqual(200);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('status');
        expect(response.result).toHaveProperty('data');
        expect(response.result.data).toHaveProperty('id');
        expect(response.result.data).toHaveProperty('name');
        expect(response.result.data).toHaveProperty('email');
        expect(response.result.data).toHaveProperty('phoneNumber');
        expect(response.result.data).toHaveProperty('profilePicture');
        expect(response.result.data).toHaveProperty('isVerifiedEmail');
        expect(response.result.data).toHaveProperty('lastLogin');
        expect(response.result.data).toHaveProperty('dateCreated');
        expect(response.result.data).toHaveProperty('dateUpdated');
    });
});

describe('GET /sellers/{id} [Failed: Not Found]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    let response = null;

    beforeEach(async () => {
        const user_response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
            headers,
        });
        response = await server.inject({
            method: 'GET',
            url: `/sellers/${user_response.result.data.id + 1}`,
            headers,
        });
    });

    test('Should return 404', () => {
        expect(response.statusCode).toEqual(404);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.statusCode).toEqual(404);
        expect(response.result.error).toEqual('Not Found');
        expect(response.result.message).toEqual('Seller Not Found');
    });
});

describe('PUT /sellers/{id} [Success: Without Change Email]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    const newPayload = {
        name: 'Abdul Muis (updated)',
        email: payload.email,
        phoneNumber: payload.phoneNumber,
    };
    let response = null;

    beforeEach(async () => {
        const user_response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
            headers,
        });
        response = await server.inject({
            method: 'PUT',
            url: `/sellers/${user_response.result.data.id}`,
            payload: newPayload,
            headers,
        });
    });

    test('Should return 200', () => {
        expect(response.statusCode).toEqual(200);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('status');
        expect(response.result).toHaveProperty('data');
        expect(response.result.data).toHaveProperty('id');
        expect(response.result.data).toHaveProperty('name');
        expect(response.result.data).toHaveProperty('email');
        expect(response.result.data).toHaveProperty('phoneNumber');
        expect(response.result.data).toHaveProperty('profilePicture');
        expect(response.result.data).toHaveProperty('isVerifiedEmail');
        expect(response.result.data).toHaveProperty('lastLogin');
        expect(response.result.data).toHaveProperty('dateCreated');
        expect(response.result.data).toHaveProperty('dateUpdated');
    });

    test('Should return expected response value', () => {
        expect(response.result.status).toEqual('success');
        expect(response.result.data.name).toEqual(newPayload.name);
        expect(response.result.data.email).toEqual(newPayload.email);
        expect(response.result.data.phoneNumber).toEqual(newPayload.phoneNumber);
    });
});

describe('PUT /sellers/{id} [Success: With Change Email]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    const newPayload = {
        name: 'Abdul Muis (updated)',
        email: 'abdulmuis1009@gmail.com',
        phoneNumber: payload.phoneNumber,
    };
    let response = null;
    let verifiedUser = null;

    beforeEach(async () => {
        const user_response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
            headers,
        });
        const token = await tokenHelpers.createToken({
            referenceName: tokenConstant.referenceName.SELLER,
            referenceId: user_response.result.data.id,
        });
        await server.inject({
            method: 'GET',
            url: `/sellers/verification/email?token=${token.token}`,
            headers,
        });
        verifiedUser = await server.inject({
            method: 'GET',
            url: `/sellers/${user_response.result.data.id}`,
            headers,
        });
        response = await server.inject({
            method: 'PUT',
            url: `/sellers/${user_response.result.data.id}`,
            payload: newPayload,
            headers,
        });
    });

    test('Should return 200', () => {
        expect(response.statusCode).toEqual(200);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('status');
        expect(response.result).toHaveProperty('data');
        expect(response.result.data).toHaveProperty('id');
        expect(response.result.data).toHaveProperty('name');
        expect(response.result.data).toHaveProperty('email');
        expect(response.result.data).toHaveProperty('phoneNumber');
        expect(response.result.data).toHaveProperty('profilePicture');
        expect(response.result.data).toHaveProperty('isVerifiedEmail');
        expect(response.result.data).toHaveProperty('lastLogin');
        expect(response.result.data).toHaveProperty('dateCreated');
        expect(response.result.data).toHaveProperty('dateUpdated');
    });

    test('Should return expected response value', () => {
        expect(response.result.status).toEqual('success');
        expect(response.result.data.name).toEqual(newPayload.name);
        expect(response.result.data.email).toEqual(newPayload.email);
        expect(response.result.data.phoneNumber).toEqual(newPayload.phoneNumber);
    });

    test('isVerified should change if email changed and previous email verified', () => {
        expect(verifiedUser.result.data.isVerifiedEmail).toEqual(true);
        expect(response.result.data.isVerifiedEmail).toEqual(false);
    });
});

describe('PUT /sellers/{id} [Failed: Not Found]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    const newPayload = {
        name: 'Abdul Muis (updated)',
        email: payload.email,
        phoneNumber: payload.phoneNumber,
    };
    let response = null;

    beforeEach(async () => {
        const user_response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
            headers,
        });
        response = await server.inject({
            method: 'PUT',
            url: `/sellers/${user_response.result.data.id + 1}`,
            payload: newPayload,
            headers,
        });
    });

    test('Should return 404', () => {
        expect(response.statusCode).toEqual(404);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.statusCode).toEqual(404);
        expect(response.result.error).toEqual('Not Found');
        expect(response.result.message).toEqual('Seller Not Found');
    });
});

describe('GET /sellers/verification/email [Success]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    let response = null;
    let updated_response = null;

    beforeEach(async () => {
        const user_response = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
            headers,
        });
        const token = await tokenHelpers.createToken({
            referenceName: tokenConstant.referenceName.SELLER,
            referenceId: user_response.result.data.id,
        });
        response = await server.inject({
            method: 'GET',
            url: `/sellers/verification/email?token=${token.token}`,
            headers,
        });
        updated_response = await server.inject({
            method: 'GET',
            url: `/sellers/${user_response.result.data.id}`,
            headers,
        });
    });

    test('Should return 200', () => {
        expect(response.statusCode).toEqual(200);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('status');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.status).toEqual('success');
        expect(response.result.message).toEqual('Email Verified');
    });

    test('Data should updated', () => {
        expect(updated_response.result.data.isVerifiedEmail).toEqual(true);
    });
});

describe('GET /sellers/verification/email [Failed: No Token Parameter]', () => {
    let response = null;

    beforeEach(async () => {
        response = await server.inject({
            method: 'GET',
            url: `/sellers/verification/email`,
            headers,
        });
    });

    test('Should return 400', () => {
        expect(response.statusCode).toEqual(400);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.statusCode).toEqual(400);
        expect(response.result.error).toEqual('Bad Request');
        expect(response.result.message).toEqual('Missing Parameter \'token\'');
    });
});

describe('GET /sellers/verification/email [Failed: Empty Token]', () => {
    let response = null;

    beforeEach(async () => {
        response = await server.inject({
            method: 'GET',
            url: `/sellers/verification/email?token=`,
            headers,
        });
    });

    test('Should return 400', () => {
        expect(response.statusCode).toEqual(400);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.statusCode).toEqual(400);
        expect(response.result.error).toEqual('Bad Request');
        expect(response.result.message).toEqual('Missing Parameter \'token\'');
    });
});

describe('GET /sellers/forgot-password [Success]', () => {
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
            headers,
        });
        response = await server.inject({
            method: 'GET',
            url: `/sellers/forgot-password?email=${payload.email}`,
            headers,
        });
    });

    test('Should return 200', () => {
        expect(response.statusCode).toEqual(200);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('status');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.status).toEqual('success');
        expect(response.result.message).toEqual('Email Sent');
    });
});

describe('GET /sellers/forgot-password [Failed: No Email Parameter]', () => {
    let response = null;

    beforeEach(async () => {
        response = await server.inject({
            method: 'GET',
            url: `/sellers/forgot-password`,
            headers,
        });
    });

    test('Should return 400', () => {
        expect(response.statusCode).toEqual(400);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.statusCode).toEqual(400);
        expect(response.result.error).toEqual('Bad Request');
        expect(response.result.message).toEqual('Missing Parameter \'email\'');
    });
});

describe('GET /sellers/forgot-password [Failed: Empty Email]', () => {
    let response = null;

    beforeEach(async () => {
        response = await server.inject({
            method: 'GET',
            url: `/sellers/forgot-password?email=`,
            headers,
        });
    });

    test('Should return 400', () => {
        expect(response.statusCode).toEqual(400);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.statusCode).toEqual(400);
        expect(response.result.error).toEqual('Bad Request');
        expect(response.result.message).toEqual('Missing Parameter \'email\'');
    });
});

describe('GET /sellers/forgot-password [Failed: Invalid Email Address]', () => {
    let response = null;

    beforeEach(async () => {
        response = await server.inject({
            method: 'GET',
            url: `/sellers/forgot-password?email=abdulmuis1009@gmail`,
            headers,
        });
    });

    test('Should return 400', () => {
        expect(response.statusCode).toEqual(400);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.statusCode).toEqual(400);
        expect(response.result.error).toEqual('Bad Request');
        expect(response.result.message).toEqual('Invalid Email Address');
    });
});

describe('GET /sellers/forgot-password [Failed: Seller Not Found]', () => {
    let response = null;

    beforeEach(async () => {
        response = await server.inject({
            method: 'GET',
            url: `/sellers/forgot-password?email=abdulmuis1009@gmail.com`,
            headers,
        });
    });

    test('Should return 404', () => {
        expect(response.statusCode).toEqual(404);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.statusCode).toEqual(404);
        expect(response.result.error).toEqual('Not Found');
        expect(response.result.message).toEqual('Seller Not Found');
    });
});

describe('POST /sellers/forgot-password [Success]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    const newPayload = {
        password: 'testing-updated',
    };
    let response = null;
    let loginResponse = null;
    let loginAfterUpdateResponse = null;

    beforeEach(async () => {
        const userResponse = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
            headers,
        });
        loginResponse = await server.inject({
            method: 'POST',
            url: '/sellers/login',
            payload: { email: payload.email, password: payload.password },
            headers,
        });
        const tokenData = await tokenHelpers.createToken({
            referenceName: tokenConstant.referenceName.SELLER,
            referenceId: userResponse.result.data.id,
        });
        response = await server.inject({
            method: 'POST',
            url: '/sellers/forgot-password',
            payload: { password: newPayload.password, token: tokenData.token },
            headers,
        });
        loginAfterUpdateResponse = await server.inject({
            method: 'POST',
            url: '/sellers/login',
            payload: { email: payload.email, password: newPayload.password },
            headers,
        });
    });

    test('Should return 200', () => {
        expect(response.statusCode).toEqual(200);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('status');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expeted response value', () => {
        expect(response.result.status).toEqual('success');
        expect(response.result.message).toEqual('Password Updated');
    });

    test('Should return 200 when login before password changed', () => {
        expect(loginResponse.statusCode).toEqual(200);
    });

    test('Should return 200 when login after password changed', () => {
        expect(loginAfterUpdateResponse.statusCode).toEqual(200);
    });
});

describe('POST /sellers/forgot-password [Failed: Token Not Found]', () => {
    let response = null;

    beforeEach(async () => {
        response = await server.inject({
            method: 'POST',
            url: '/sellers/forgot-password',
            payload: { password: 'some-password', token: 'some-invalid-token' },
            headers,
        });
    });

    test('Should return 404', () => {
        expect(response.statusCode).toEqual(404);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.statusCode).toEqual(404);
        expect(response.result.error).toEqual('Not Found');
        expect(response.result.message).toEqual('Token Not Found');
    });
});

describe('POST /sellers/forgot-password [Failed: Seller Not Found]', () => {
    const payload = {
        name: 'Abdul Muis',
        email: 'dev.abdulmuis@gmail.com',
        phoneNumber: '08362532',
        password: 'testing',
    };
    let response = null;

    beforeEach(async () => {
        const userResponse = await server.inject({
            method: 'POST',
            url: '/sellers/register',
            payload,
            headers,
        });
        const tokenData = await tokenHelpers.createToken({
            referenceName: tokenConstant.referenceName.SELLER,
            referenceId: userResponse.result.data.id + 1,
        });
        response = await server.inject({
            method: 'POST',
            url: '/sellers/forgot-password',
            payload: { password: 'some-password', token: tokenData.token },
            headers,
        });
    });

    test('Should return 404', () => {
        expect(response.statusCode).toEqual(404);
    });

    test('Should return expected response', () => {
        expect(response.result).toHaveProperty('statusCode');
        expect(response.result).toHaveProperty('error');
        expect(response.result).toHaveProperty('message');
    });

    test('Should return expected response value', () => {
        expect(response.result.statusCode).toEqual(404);
        expect(response.result.error).toEqual('Not Found');
        expect(response.result.message).toEqual('Seller Not Found');
    });
});