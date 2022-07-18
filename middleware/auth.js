const boom = require('@hapi/boom');
const jwt = require('../utils/token');

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

module.exports = {
    JwtAuth,
};
