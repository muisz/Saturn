const RabbitMQ = require('../utils/rabbitmq');

const rabbitmq = new RabbitMQ();
const queue = process.env.RABBITMQ_EMAIL_QUEUE;

const sendEmail = async (to, template, templateData) => {
    if (process.env.NODE_ENV !== 'test') {
        await rabbitmq.connect(queue);
        rabbitmq.sendMessage({ to, body: template(templateData) });
    }
};

module.exports = {
    sendEmail,
};
