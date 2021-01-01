'use strict';

const hapi = require('@hapi/hapi');
const hapiJoi = require('@hapi/joi');
const jwt = require('hapi-auth-jwt2');
const config = require('../config');

exports.create = async port => {
    const server = new hapi.Server({
        host: '0.0.0.0',
        port: port,
        routes: {
            cors: {
                origin: ['*']
            },
        }
    });

    await registerAuthentication(server)

    server.validator(hapiJoi);

    return server;
};

async function registerAuthentication(server) {
    await server.register(jwt);

    server.auth.strategy('jwt', 'jwt', {
        validate: () => ({ isValid: true }),
        key: config.jwt.secret[config.env],
        verifyOptions: {
            algorithms: [config.jwt.algorithm]
        }
    });

    server.auth.default('jwt');
}
