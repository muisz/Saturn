const hash = require('../../utils/hash');

test('Should return string hashed password', () => {
    const password = 'testing';
    const hashed = hash.hashPassword(password);

    expect(typeof hashed).toEqual('string');
    expect(hashed).not.toEqual(password);
});

test('Should return true when verifing valid password', () => {
    const password = 'testing';
    const hashed = hash.hashPassword(password);
    const isVerified = hash.verifyPassword(password, hashed);

    expect(isVerified).toEqual(true);
});

test('Should return false when verifing invalid password', () => {
    const password = 'testing';
    const hashed = hash.hashPassword(password);
    const isVerified = hash.verifyPassword('not the password', hashed);

    expect(isVerified).toEqual(false);
});