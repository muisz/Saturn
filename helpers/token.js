const { PrismaClient } = require('@prisma/client');
const { v4: uuid4 } = require('uuid');
const tokenUtil = require('../utils/token');

const prisma = new PrismaClient();

const createToken = (data) => new Promise((resolve, reject) => {
    const tokenData = {
        token: tokenUtil.generateStringToken(),
        ...data,
    };
    prisma.token.create({ data: tokenData })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
});

const getTokenData = (token) => new Promise((resolve, reject) => {
    prisma.token.findFirst({ where: { token } })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
});

const deleteTokenById = (id) => new Promise((resolve, reject) => {
    prisma.token.delete({ where: { id: parseInt(id, 10) } })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
});

module.exports = {
    createToken,
    getTokenData,
    deleteTokenById,
};
