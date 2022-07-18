require('dotenv').config();

const hapi = require('@hapi/hapi');

const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const port = 8000;
const server = hapi.server({
    host,
    port,
});

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
