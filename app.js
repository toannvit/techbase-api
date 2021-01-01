
'use strict';
const util = require('util');
const glob = util.promisify(require('glob'));
const config = require('./src/config');
const serverFactory = require('./src/api/server.js');
const mongodb = require('./src/models/db');
const logger = require('./src/services/logger');
const shutdown = require('./src/utils/shutdown.js');

async function startServer() {
    try {
        const server = await serverFactory.create(config.server.port);

        shutdown.register(server);

        await Promise.all([
            registerRoutes(server),
            mongodb.connect(),
        ]);

        await server.start();

        logger.debug(`Server running in ${config.env} mode at: ${server.info.uri}`);
    } catch (error) {
        logger.error({ msg: error.message, error });
        process.exit(1);
    }
}

async function registerRoutes(server) {
    const cwd = `${__dirname}/src/api`;
    const files = await glob('**/*route.js', { cwd });

    for (const file of files) {
        const handler = require(`${cwd}/${file}`);

        if (!handler.method && !handler.path) {
            log.debug(`Failed to register route handler for: ${file}`);
            continue;
        }

        logger.debug(`Adding route: ${handler.method}, ${handler.path}`);
        server.route(handler);
    }
}

startServer();
