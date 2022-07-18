const { PrismaClient } = require('@prisma/client');
const jwt = require('../utils/token');

const prisma = new PrismaClient();

const createSeller = (data) => new Promise((resolve, reject) => {
    prisma.seller.create({ data })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
});

const getSellerById = (id) => new Promise((resolve, reject) => {
    prisma.seller.findFirst({ where: { id: parseInt(id, 10), isDeleted: false } })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
});

const updateSellerById = (id, data) => new Promise((resolve, reject) => {
    prisma.seller.update({
        data,
        where: { id: parseInt(id, 10) },
    })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
});

const deleteSellerById = (id) => new Promise((resolve, reject) => {
    prisma.seller.update({
        data: {
            isDeleted: true,
            dateDeleted: new Date().toISOString(),
        },
        where: {
            id: parseInt(10, id),
            isDeleted: false,
        },
    })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
});

const getSellerByEmail = (email) => new Promise((resolve, reject) => {
    prisma.seller.findFirst({ where: { email } })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
});

const getSellerByPhoneNumber = (phone) => new Promise((resolve, reject) => {
    prisma.seller.findFirst({ where: { phoneNumber: phone } })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
});

const getUserToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
    };
    const accessToken = jwt.generateToken(payload);
    const refreshToken = jwt.generateToken(payload, 12, jwt.tokenType.refreshToken);
    return { accessToken, refreshToken };
};

const serializer = (data) => ({
    id: data.id,
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    lastLogin: data.lastLogin,
    dateCreated: data.dateCreated,
    dateUpdated: data.dateUpdated,
});

module.exports = {
    createSeller,
    getSellerById,
    updateSellerById,
    deleteSellerById,
    serializer,
    getSellerByEmail,
    getSellerByPhoneNumber,
    getUserToken,
};
