const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const tokenUtil = require('../utils/token');

const prisma = new PrismaClient();

const createFile = (data) => new Promise((resolve, reject) => {
    prisma.file.create({ data })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
});

const getExtension = (filename) => {
    const ext = filename.split('.');
    return ext[ext.length - 1];
};

const generateFileName = (filename) => {
    const extension = getExtension(filename);
    return `${tokenUtil.generateStringToken()}.${extension}`;
};

const checkDirectory = (location) => {
    if (!fs.existsSync(location)) {
        fs.mkdirSync(location, { recursive: true });
    }
};

const getLocalFile = (filename) => {
    const directory = 'uploaded_files';
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = `${date.getMonth() + 1}`;
    const location = directory + path.sep + year + path.sep + month;
    checkDirectory(location);
    return location + path.sep + filename;
};

const saveLocalFile = (readablefile, filename) => new Promise((resolve, reject) => {
    try {
        const newFilename = generateFileName(filename);
        const location = getLocalFile(newFilename);
        const ws = fs.createWriteStream(location);
        readablefile.pipe(ws);
        readablefile.on('end', () => resolve(location));
    } catch (err) {
        reject(err);
    }
});

module.exports = {
    createFile,
    saveLocalFile,
};
