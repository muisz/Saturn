require('dotenv').config();

const env = process.env;

beforeAll(() => {
    jest.resetModules();
    process.env = {
        ...env,
        DATABASE_URL: env.DATABASE_URL_TEST,
    };
});

afterAll(() => {
    process.env = env;
});