'use strict';

const boom = require('@hapi/boom');
const joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const config = require('../../../config')
const employeeModel = require('../../../models/employees');


/**
 * Hapi route specification.
 */


module.exports = {
    method: 'GET',
    path: '/api/v1/users',
    options: {
        auth: 'jwt',
        validate: {
            query: joi.object({
                department: joi.string(),
                team: joi.string(),
                skip: joi
                    .number()
                    .integer()
                    .min(0)
                    .default(0),
                limit: joi
                    .number()
                    .integer()
                    .min(0)
                    .max(1500)
                    .default(100),
            })
        }
    },
    handler: async (request, h) => {
        try {
            const { department, team, skip, limit } = request.query;
            const { id, role, departmentId } = request.auth.credentials;
            
            if (role == config.roles.staff && departmentId !== department) {
                return boom.forbidden(`${id} Not allowed to search for users another deparment`);
            }

            const query = {};
            const options = {
                sort: { _id: -1 },
                skip,
                limit
            };

            if(department) {
                query[`department.id`] = ObjectId(department);
            }

            if (team) {
                query[`teams.id`] = ObjectId(team);
            }

            const [employees,  total] = await employeeModel.findEmployees(query, options);

            return h.response({
                href: request.url.href,
                items: employees,
                total
            });
        } catch (error) {
            return boom.badImplementation(error);
        }
    }
};
