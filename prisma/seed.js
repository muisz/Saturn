const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const main = async () => {
    const apikey = await prisma.apiKey.create({ data: {
        name: 'Testing',
        key: 'testingapi',
    }});
};

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });