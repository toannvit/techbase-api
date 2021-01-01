'use strict';

const boom = require('@hapi/boom');
const joi = require('@hapi/joi');
const _ = require('lodash');
const config = require('../../../../config');
const jwt = require('jsonwebtoken');
const { employeesRepo } = require('../../../../models/repositories');
/**
 * Hapi route specification.
 */
module.exports = {
    method: 'POST',
    path: '/api/v1/users/verify',
    options: {
        auth: false,
        validate: {
            payload: joi.object({
                email: joi
                    .string()
                    .trim()
                    .allow('')
                    .max(4096)
                    .email()
            })
        }
    },
    handler: async (request, h) => {
        try {
            const { email } = request.payload;

            const user = await employeesRepo.findOne({
                email
            }, {
                projection: {
                    email: 1,
                    role: 1,
                    'department.id': 1
                }
            });

            if(!user) {
                return boom.notFound(`User not found`);
            }

            const jwtData = { 
                id: String(user._id),
                email: user.email,
                role: user.role,
                deparmentId: user.department.id
            };

            return h
                .response({
                    href: request.url.href,
                    item: user
                })
                .header(
                    'authorization',
                    jwt.sign(jwtData, config.jwt.secret[config.env], {
                        algorithm: config.jwt.algorithm,
                        noTimestamp: true,
                        expiresIn: config.jwt.expiresInSeconds
                    })
                );

        } catch (error) {
            return boom.badImplementation(error);
        }
    }
};
