const sellerHandlers = require('./handlers/seller');
const fileHandler = require('./handlers/file');

const routes = [
    // seller handlers
    {
        method: 'POST',
        path: '/sellers/register',
        handler: sellerHandlers.createSellerHandler,
        options: {
            auth: 'apikey',
        },
    },
    {
        method: 'POST',
        path: '/sellers/login',
        handler: sellerHandlers.loginSellerHandler,
        options: {
            auth: 'apikey',
        },
    },
    {
        method: 'GET',
        path: '/sellers/{id}',
        handler: sellerHandlers.detailSellerHandler,
        options: {
            auth: {
                strategies: ['apikey', 'jwt'],
            },
        },
    },
    {
        method: 'PUT',
        path: '/sellers/{id}',
        handler: sellerHandlers.updateSellerHandler,
        options: {
            auth: {
                strategies: ['apikey', 'jwt'],
            },
        },
    },
    {
        method: 'GET',
        path: '/sellers/verification/email',
        handler: sellerHandlers.verificateEmailHandler,
        options: {
            auth: 'apikey',
        },
    },
    {
        method: 'GET',
        path: '/sellers/forgot-password',
        handler: sellerHandlers.sendEmailForgotPasswordTokenHandler,
        options: {
            auth: 'apikey',
        },
    },
    {
        method: 'POST',
        path: '/sellers/forgot-password',
        handler: sellerHandlers.forgotPasswordHandler,
        options: {
            auth: 'apikey',
        },
    },

    // file
    {
        method: 'POST',
        path: '/file',
        handler: fileHandler.uploadFileHandler,
        options: {
            auth: {
                strategies: ['apikey', 'jwt'],
            },
            payload: {
                output: 'stream',
                multipart: true,
            },
        },
    },
];

module.exports = routes;
