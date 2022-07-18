const jwt = require('../../utils/token');

test('Should return string token', () => {
    const payload = { name: 'Muhamad Abdul Muis' };
    const token = jwt.generateToken(payload);

    expect(typeof token).toEqual('string');
    expect(token).not.toEqual('');
});

test('Should return exact data payload from token', () => {
    const payload = { name: 'Muhamad Abdul Muis' };
    const token = jwt.generateToken(payload);
    const data = jwt.decodeToken(token);

    expect(typeof data).toEqual('object');
    expect(data).toHaveProperty('name');
    expect(data.name).toEqual(payload.name);
});

test('Should throw error JsonWebTokenError invalid signature when decoded with wrong key', () => {
    try {
        const payload = { name: 'Muhamad Abdul Muis' };
        const token = jwt.generateToken(payload);
        const data = jwt.decodeToken(token, jwt.tokenType.refreshToken);
    } catch (err) {
        expect(err.name).toEqual('JsonWebTokenError');
        expect(err.message).toEqual('invalid signature');
    }
});