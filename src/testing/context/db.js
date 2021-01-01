'use strict';

const MongoMemoryServer = require('mongodb-memory-server').default;
const mongodb = require('../../../src/models/db');

exports.connectToDb = async t => {
    const db = new MongoMemoryServer();
    const uri = await db.getUri();
    const name = await db.getDbName();

    await mongodb.connect(uri, name);

    t.context.db = db;
};

exports.disconnectFromDb = async t => {
    const { db } = t.context;
    db.stop();
};
