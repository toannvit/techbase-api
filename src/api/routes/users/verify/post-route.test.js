'use strict';

const test = require('ava');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const config = require('./../../../../config');
const { startApi, stopApi } = require('../../../../testing/context/api.js');
const { employeesRepo } = require('../../../../models/repositories');
const builder = require('../../../../testing/builders');
const auth = require('../../../../testing/utils');

test.before(async t => {
    await startApi(t, require('./post-route.js'));

    const employee = builder.createEmployee()
        .withDepartment({
            id: ObjectID(),
            ts: Date.now()
        })
        .withEmail('valid@email.com')
        .withRole(config.roles.manager)
        .build();

    await employeesRepo.insertMany([employee]);

    t.context.employee = employee;
});

test.after(stopApi);

test('Sign in with valid email should be successful', async t => {
    const { api } = t.context;
    
    const email = 'valid@email.com';
    const reply = await api.inject({
        method: 'POST',
        url: `/api/v1/users/verify`,
        payload: {
            email
        },
    });

    const item = _.get(reply, 'result.item');

    t.is(200, reply.statusCode);
    t.is(email, item.email);

});

test('Sign in with invalid email should return not found', async t => {
    const { api } = t.context;
    
    const email = 'invalid@email.com';
    const reply = await api.inject({
        method: 'POST',
        url: `/api/v1/users/verify`,
        payload: {
            email
        },
    });

    t.is(404, reply.statusCode);

});
