require('dotenv').config();

const hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');
const path = require('path');
const auth = require('./middleware/auth');
const routes = require('./routes');

const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const port = 8000;
const server = hapi.server({
    host,
    port,
});

server.auth.scheme('jwtscheme', auth.JwtAuth);
server.auth.scheme('apikeyscheme', auth.APIKeyAuth);

server.auth.strategy('jwt', 'jwtscheme', { name: 'jwt' });
server.auth.strategy('apikey', 'apikeyscheme', { name: 'apikey' });

server.route(routes);

const initialize = async () => {
    await server.initialize();
    return server;
};

const start = async () => {
    await server.start();
    console.log(`server started on ${host}:${port}`);
    return server;
};

module.exports = {
    initialize,
    start,
};
