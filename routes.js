const sellerHandlers = require('./handlers/seller');

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
];

module.exports = routes;
