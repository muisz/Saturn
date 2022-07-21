const boom = require('@hapi/boom');
const helpers = require('../helpers/file');

//
// POST /file
const uploadFileHandler = async (request, h) => {
    const { file } = request.payload;
    const location = await helpers.saveLocalFile(file, file.hapi.filename);
    const { protocol } = request.server.info;
    const savedFile = await helpers.createFile({
        url: `${protocol}://${process.env.UPLOAD_SERVER_HOST}/${location}`,
        location,
    });
    return h.response({
        status: 'success',
        data: {
            id: savedFile.id,
            url: savedFile.url,
        },
    }).code(201);
};

module.exports = {
    uploadFileHandler,
};
