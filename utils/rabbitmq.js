const amqp = require('amqplib/callback_api');

class RabbitMQ {
    constructor() {
        this.server = process.env.RABBITMQ_SERVER;
    }

    async connect(queue) {
        const connection = await amqp.connect(this.server);
        const channel = await connection.createChannel();
        channel.assertQueue(queue, { durable: true });
        this.connection = connection;
        this.channel = channel;
        this.queue = queue;
    }

    sendMessage(data) {
        this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)), { persistent: true });
    }

    close() {
        this.channel.close();
        this.connection.close();
    }
}

module.exports = RabbitMQ;
