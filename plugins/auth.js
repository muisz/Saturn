const auth = require('../middleware/auth');

const AuthPlugin = {
    name: 'authPlugin',
    version: '1.0.0',
    register: async function (server, option) {
        server.auth.scheme('jwtscheme', auth.JwtAuth);
        server.auth.scheme('apikeyscheme', auth.APIKeyAuth);

        server.auth.strategy('jwt', 'jwtscheme');
        server.auth.strategy('apikey', 'apikeyscheme');
    },
};

module.exports = AuthPlugin;
