'use strict';

const db = require('./db');
const serverFactory = require('../../api/server');

exports.startApi = async (t, routes) => {
    if (Array.isArray(routes)) {
        t.context.api = await serverWithRoutes(routes);
    }

    if (typeof routes === 'object') {
        t.context.api = await serverWithRoute(routes);
    }

    await Promise.all([
        db.connectToDb(t)
    ]);
};

exports.stopApi = async t => {
    await db.disconnectFromDb(t);
};

async function serverWithRoutes(routes) {
    const server = await serverFactory.create();
    routes.forEach(r => server.route(r));
    return server;
}

async function serverWithRoute(route) {
    const server = await serverFactory.create();
    server.route(route);
    return server;
}
