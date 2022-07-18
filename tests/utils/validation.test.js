const validation = require('../../utils/validation');

test('Should return true when validating valid email', () => {
    const isValid = validation.validateEmail('dev.abdulmuis@gmail.com');

    expect(isValid).toEqual(true);
});

test('Should return false when validating invalid emails', () => {
    const isValid1 = validation.validateEmail('dev.abdulmuis.com');
    const isValid2 = validation.validateEmail('dev.abdulmuis@gmail');
    const isValid3 = validation.validateEmail('dev.abdulmuis@.com');
    const isValid4 = validation.validateEmail('dev.abdulmui$@gmail.com');

    expect(isValid1).toEqual(false);
    expect(isValid2).toEqual(false);
    expect(isValid3).toEqual(false);
    expect(isValid4).toEqual(false);
});

test('Should return true when validating valid phone number', () => {
    const isValid = validation.validatePhoneNumber('08577124252');

    expect(isValid).toEqual(true);
});

test('Should return false when validating invalid phone numbers', () => {
    const isValid1 = validation.validatePhoneNumber('-3927932');
    const isValid2 = validation.validatePhoneNumber('39279#32');
    const isValid3 = validation.validatePhoneNumber('395d27932');
    const isValid4 = validation.validatePhoneNumber('395d27_932');
    const isValid5 = validation.validatePhoneNumber('395d27-932');

    expect(isValid1).toEqual(false);
    expect(isValid2).toEqual(false);
    expect(isValid3).toEqual(false);
    expect(isValid4).toEqual(false);
    expect(isValid5).toEqual(false);
});