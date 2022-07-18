const boom = require('@hapi/boom');
const helpers = require('../helpers/seller');
const hash = require('../utils/hash');
const validation = require('../utils/validation');

//
// POST /sellers
const createSellerHandler = async (request, h) => {
    try {
        const {
            name,
            email,
            password,
            phoneNumber,
        } = request.payload;
        if (!validation.validateEmail(email)) {
            return boom.badRequest('Invalid Email Address');
        }
        if (!validation.validatePhoneNumber(phoneNumber)) {
            return boom.badRequest('Invalid Phone Number');
        }
        const seller = await helpers.createSeller({
            name,
            email,
            phoneNumber,
            password: hash.hashPassword(password),
        });
        const response = helpers.serializer(seller);
        return h.response({
            status: 'success',
            data: response,
        }).code(201);
    } catch (err) {
        if (err.message.indexOf('Unique constraint failed on the fields: (`email`)') !== -1) {
            throw boom.badRequest('Email Already Exist');
        }
        if (err.message.indexOf('Unique constraint failed on the fields: (`phoneNumber`)') !== -1) {
            throw boom.badRequest('Phone Number Already Exist');
        }
        throw err;
    }
};

//
// POST /sellers/login
const loginSellerHandler = async (request, h) => {
    const { email, password, phoneNumber } = request.payload;
    let user = null;
    if (email) {
        if (!validation.validateEmail(email)) {
            return boom.badRequest('Invalid Email Address');
        }
        user = await helpers.getSellerByEmail(email);
    }
    if (phoneNumber) {
        if (!validation.validatePhoneNumber(phoneNumber)) {
            return boom.badRequest('Invalid Phone Number');
        }
        user = await helpers.getSellerByPhoneNumber(phoneNumber);
    }
    if (!user) {
        return boom.notFound('Seller Not Found');
    }
    if (!hash.verifyPassword(password, user.password)) {
        return boom.notFound(`Invalid ${email ? 'email' : 'phone number'} or Password`);
    }
    await helpers.updateSellerById(user.id, { lastLogin: new Date().toISOString() });
    const response = {
        ...helpers.serializer(user),
        ...helpers.getUserToken(user),
    };
    return h.response({
        status: 'success',
        data: response,
    });
};

module.exports = {
    createSellerHandler,
    loginSellerHandler,
};
