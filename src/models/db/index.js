'use strict';

const { MongoClient } = require('mongodb');
const _ = require('lodash');
const config = require('../../config');
const log = require('../../services/logger.js');

let db;

async function connect(uri, dbName) {
    try {
        uri = uri || config.mongo.connectionString[config.env];
        dbName = dbName || config.mongo.dbName[config.env];

        const client = await MongoClient.connect(uri, {
            connectTimeoutMS: 30000,
            socketTimeoutMS: 0,
            poolSize: 100, 
            keepAlive: true, 
            keepAliveInitialDelay: 2000,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        
        log.debug(`Connected to uri: ${uri}/${dbName}`);
        
        db = client.db(dbName);
        listenToEvents(db);

    } catch (error) {
        log.error({
            tags: ['mongodb', 'connect'],
            msg: 'could not connect to mongodb database, will shutdown server.',
            err: error
        });
        throw error;
    }
}

function instance() {
    if (!db) {
        throw new Error('no connected to mongodb or failed to connect to mongodb');
    }
    return db;
}

function listenToEvents(db) {
    db.on('close', function(error) {
        const message = `mongodb:close ${_.get(error, 'message', '')}`;
        log.error({ tags: ['mongodb', 'event'], msg: message });
    });

    db.on('error', function(error) {
        const message = `mongodb:error ${_.get(error, 'message', '')}`;
        log.error({ tags: ['mongodb', 'event'], msg: message });
    });
}

module.exports = {
    connect,
    instance
};
