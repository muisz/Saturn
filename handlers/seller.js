const boom = require('@hapi/boom');
const helpers = require('../helpers/seller');
const tokenHelpers = require('../helpers/token');
const emailHelpers = require('../helpers/email');
const hash = require('../utils/hash');
const validation = require('../utils/validation');
const tokenConstant = require('../constants/token');
const emailTemplate = require('../templates/email');

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
            lastLogin: new Date().toISOString(),
        });
        const tokenData = await tokenHelpers.createToken({
            referenceName: tokenConstant.referenceName.SELLER,
            referenceId: seller.id,
        });
        emailHelpers.sendEmail(seller.email, emailTemplate.emailVerification, {
            name: seller.name,
            redirectUrl: process.env.FORGOT_PASSWORD_REDIRECT_URL,
            token: tokenData.token,
        });
        const response = {
            ...helpers.serializer(seller),
            ...helpers.getUserToken(seller),
        };
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

//
// GET /sellers/{id}
const detailSellerHandler = async (request, h) => {
    const { id } = request.params;
    const seller = await helpers.getSellerById(id);
    if (!seller) {
        return boom.notFound('Seller Not Found');
    }
    const response = helpers.serializer(seller);
    return h.response({
        status: 'success',
        data: response,
    });
};

//
// PUT /sellers/{id}
const updateSellerHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const {
            name,
            email,
            phoneNumber,
            profilePicture,
        } = request.payload;
        if (!validation.validateEmail(email)) {
            return boom.badRequest('Invalid Email Address');
        }
        if (!validation.validatePhoneNumber(phoneNumber)) {
            return boom.badRequest('Invalid Phone Number');
        }
        const seller = await helpers.getSellerById(id);
        if (!seller) {
            return boom.notFound('Seller Not Found');
        }
        let needEmailVerification = false;
        if (email !== seller.email) {
            needEmailVerification = true;
        }
        const updated = await helpers.updateSellerById(seller.id, {
            name,
            email,
            phoneNumber,
            profilePicture,
            isVerifiedEmail: needEmailVerification ? false : seller.isVerifiedEmail,
            dateUpdated: new Date().toISOString(),
        });
        if (needEmailVerification) {
            const tokenData = await tokenHelpers.createToken({
                referenceName: tokenConstant.referenceName.SELLER,
                referenceId: seller.id,
            });
            emailHelpers.sendEmail(seller.email, emailTemplate.emailVerification, {
                name: seller.name,
                redirectUrl: process.env.FORGOT_PASSWORD_REDIRECT_URL,
                token: tokenData.token,
            });
        }
        const response = helpers.serializer(updated);
        return h.response({
            status: 'success',
            data: response,
        });
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
// GET /sellers/verification/email
const verificateEmailHandler = async (request, h) => {
    try {
        const { token } = request.query;
        if (!token) {
            return boom.badRequest('Missing Parameter \'token\'');
        }
        const tokenData = await tokenHelpers.getTokenData(token);
        if (!token) {
            return boom.notFound('Token Not Found');
        }
        if (tokenData.referenceName === tokenConstant.referenceName.SELLER) {
            const seller = await helpers.getSellerById(tokenData.referenceId);
            if (!seller) {
                throw new Error();
            }
            await helpers.updateSellerById(seller.id, {
                isVerifiedEmail: true,
                dateUpdated: new Date().toISOString(),
            });
            return h.response({
                status: 'success',
                message: 'Email Verified',
            });
        }
        throw new Error();
    } catch (err) {
        return boom.notFound('Token Not Found');
    }
};

//
// GET /sellers/forgot-password
const sendEmailForgotPasswordTokenHandler = async (request, h) => {
    const { email } = request.query;
    if (!email) {
        return boom.badRequest('Missing Parameter \'email\'');
    }
    if (!validation.validateEmail(email)) {
        return boom.badRequest('Invalid Email Address');
    }
    const seller = await helpers.getSellerByEmail(email);
    if (!seller) {
        return boom.notFound('Seller Not Found');
    }
    const token = await tokenHelpers.createToken({
        referenceName: tokenConstant.referenceName.SELLER,
        referenceId: seller.id,
    });
    emailHelpers.sendEmail(seller.email, emailTemplate.forgotPassword, {
        name: seller.name,
        redirectUrl: process.env.FORGOT_PASSWORD_REDIRECT_URL,
        token: token.token,
    });
    return h.response({
        status: 'success',
        message: 'Email Sent',
    });
};

//
// POST /sellers/forgot-password
const forgotPasswordHandler = async (request, h) => {
    const { password, token } = request.payload;
    const tokenData = await tokenHelpers.getTokenData(token);
    if (!tokenData) {
        return boom.notFound('Token Not Found');
    }
    if (tokenData.referenceName !== tokenConstant.referenceName.SELLER) {
        return boom.notFound('Token Not Found');
    }
    const seller = await helpers.getSellerById(tokenData.referenceId);
    if (!seller) {
        return boom.notFound('Seller Not Found');
    }
    await helpers.updateSellerById(seller.id, {
        password: hash.hashPassword(password),
        dateUpdated: new Date().toISOString(),
    });
    await tokenHelpers.deleteTokenById(tokenData.id);
    return h.response({
        status: 'success',
        message: 'Password Updated',
    });
};

module.exports = {
    createSellerHandler,
    loginSellerHandler,
    detailSellerHandler,
    updateSellerHandler,
    verificateEmailHandler,
    sendEmailForgotPasswordTokenHandler,
    forgotPasswordHandler,
};
