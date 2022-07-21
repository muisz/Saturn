const boom = require('@hapi/boom');
const { PrismaClient } = require('@prisma/client');
const jwt = require('../utils/token');

const prisma = new PrismaClient();

const JwtAuth = (server, options) => ({
    async authenticate(request, h) {
        try {
            const { headers } = request;
            const { authorization } = headers;
            if (!authorization) {
                throw boom.unauthorized('Unauthorized');
            }
            const [authType, authToken] = authorization.split(' ');
            if (authType !== 'Bearer') {
                throw boom.unauthorized('Invalid Authentication Type');
            }
            const payload = jwt.decodeToken(authToken);
            return h.authenticated({ credentials: payload, artifacts: null });
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                throw boom.unauthorized('Invalid Token');
            }
            if (err.name === 'TokenExpiredError') {
                throw boom.unauthorized('Token Expired');
            }
            throw err;
        }
    },
});

const APIKeyAuth = (server, options) => ({
    async authenticate(request, h) {
        try {
            const { headers, auth } = request;
            const { credentials } = auth;
            const apikey = headers['x-api-key'];
            if (!apikey) {
                return boom.unauthorized('Unauthorized API');
            }
            const api = await prisma.apiKey.findFirst({ where: { key: apikey } });
            if (!api) {
                return boom.unauthorized('Unauthorized API');
            }
            const { strategies } = request.route.settings.auth;
            if (strategies[strategies.length - 1] !== options.name) {
                return boom.unauthorized(null, 'jwtsheme');
            }
            return h.authenticated({ credentials: { apikey }, artifacts: null });
        } catch (err) {
            return boom.unauthorized('Unauthorized API');
        }
    },
});

module.exports = {
    JwtAuth,
    APIKeyAuth,
};
