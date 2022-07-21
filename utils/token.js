const jwt = require('jsonwebtoken');
const { v4: uuid4 } = require('uuid');

const tokenType = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
};

const ACCESS_KEY = process.env.JWT_ACCESS_KEY;
const REFRESH_KEY = process.env.JWT_REFRESH_KEY;

const generateToken = (payload, exp = 6, type = tokenType.accessToken) => {
    const tokenPayload = {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + (exp * 60 * 60),
    };
    const key = type === tokenType.accessToken ? ACCESS_KEY : REFRESH_KEY;
    const token = jwt.sign(tokenPayload, key);
    return token;
};

const decodeToken = (token, type = tokenType.accessToken) => {
    const key = type === tokenType.accessToken ? ACCESS_KEY : REFRESH_KEY;
    const data = jwt.verify(token, key);
    return data;
};

const generateStringToken = () => {
    const uuid = uuid4();
    return uuid.replace(/-/g, '');
};

module.exports = {
    generateToken,
    decodeToken,
    tokenType,
    generateStringToken,
};
