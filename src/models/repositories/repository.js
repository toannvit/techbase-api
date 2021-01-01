const db = require('../db/index.js');

class Repository {
    constructor(collectionName) {
        this.name = collectionName;
    }

    collection() {
        return db.instance().collection(this.name);
    }

    find(query, options) {
        return this.collection()
            .find(query, options)
            .toArray();
    }

    findToCursor(query, options) {
        return this.collection().find(query, options);
    }

    findOne(query, options) {
        return this.collection().findOne(query, options);
    }

    async updateOne(query, update, options) {
        const commandResult = await this.collection().updateOne(query, update, options);
        return commandResult.result;
    }

    async updateMany(query, update, options) {
        const commandResult = await this.collection().updateMany(query, update, options);
        return commandResult.result;
    }

    async findOneAndUpdate(query, update, options) {
        const result = await this.collection().findOneAndUpdate(query, update, options);
        return result.value;
    }

    deleteOne(query, options) {
        return this.collection().deleteOne(query, options);
    }

    deleteMany(query, options) {
        return this.collection().deleteMany(query, options);
    }

    insertOne(doc, options) {
        return this.collection().insertOne(doc, options);
    }

    insertMany(docs, options) {
        return this.collection().insertMany(docs, options);
    }

    countDocuments(query, options) {
        return this.collection().countDocuments(query, options);
    }

    initializeOrderedBulkOp(options) {
        return this.collection().initializeOrderedBulkOp(options);
    }

    initializeUnorderedBulkOp(options) {
        return this.collection().initializeUnorderedBulkOp(options);
    }

    bulkWrite(bulk, options) {
        return this.collection().bulkWrite(bulk, options);
    }

    aggregate(pipeline, options) {
        return this.collection()
            .aggregate(pipeline, options)
            .toArray();
    }

    distinct(field, query) {
        return this.collection().distinct(field, query);
    }
}

module.exports = Repository;
