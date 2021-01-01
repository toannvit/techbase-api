'use strict';

const logger = require('../services/logger.js');

const exception = 'uncaughtException';
const rejection = 'unhandledRejection';

exports.register = server => {
    process.on(exception, error => handler(server, exception, error));
    process.on(rejection, error => handler(server, rejection, error));
};

async function handler(server, type, error) {
    try {
        await server.stop({ timeout: 5 * 1000 });
        shutdown(type, error);
    } catch (e) {
        finalLogger.error({
            tags: ['unexpected'],
            msg: 'could not shutdown',
            err: e
        });
        shutdown(type, error);
    }
}

function shutdown(type, error) {
    logger.error({
        tags: ['unexpected'],
        msg: `${type} occured will reboot server`,
        err: error
    });

    process.exit(1);
}
