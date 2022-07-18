const validateEmail = (email) => {
    if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return true;
    }
    return false;
};

const validatePhoneNumber = (phone) => {
    if (phone.match(/^\d+$/)) {
        return true;
    }
    return false;
};

module.exports = {
    validateEmail,
    validatePhoneNumber,
};
