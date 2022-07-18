const sellerHandlers = require('./handlers/seller');

const routes = [
    // seller handlers
    {
        method: 'POST',
        path: '/sellers/register',
        handler: sellerHandlers.createSellerHandler,
        options: {
            auth: false,
        },
    },
    {
        method: 'POST',
        path: '/sellers/login',
        handler: sellerHandlers.loginSellerHandler,
        options: {
            auth: false,
        },
    },
];

module.exports = routes;
