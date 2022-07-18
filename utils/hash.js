const bcrypt = require('bcrypt');

const hashPassword = (password) => bcrypt.hashSync(password, 10);

const verifyPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

module.exports = {
    hashPassword,
    verifyPassword,
};
