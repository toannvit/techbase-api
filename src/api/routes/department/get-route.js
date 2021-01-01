'use strict';

const Boom = require('@hapi/boom');
const _ = require('lodash');

/**
 * Hapi route specification.
 */
module.exports = {
    method: 'GET',
    path: '/v1/users/{id}',
    config: {
        auth: false,
    },
    handler: async (request, h) => {
        return 'Hello';
    }
};
