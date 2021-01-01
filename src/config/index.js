

// Node environment.
const env = (() => {
    switch (process.env.NODE_ENV) {
        case 'production':
        case 'development':
        case 'test':
            return process.env.NODE_ENV;

        default:
            return 'local';
    }
})();


const isDevelopment = process.env.NODE_ENV === 'development';
const isTesting = process.env.NODE_ENV === 'test';

module.exports = {
    env,

    isDevelopment,
    isTesting,

    server: {
        port: process.env.PORT || 3000
    },

    mongo: {
        connectionString: {
            development: `mongodb+srv://${process.env.MONGODB_DEV_USER}:${process.env.MONGODB_DEV_PASS}@${process.env.MONGODB_DEV_URI}?retryWrites=true&w=majority`,
        },
        dbName: {
            development: process.env.MONGODB_NAME || 'techbase',
        }
    },

    jwt: {
        algorithm: 'HS256',
        secret: {
            test: 'TEST_SUPER_SECRECT',
            development: 'DEVELOPMENT_SUPER_SECRECT',
        },
        expiresInSeconds: 3 * 3600 
    },

    roles: {
        director: 'director',
        manager: 'manager',
        staff: 'staff',
    }
}