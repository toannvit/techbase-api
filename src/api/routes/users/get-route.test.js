'use strict';

const test = require('ava');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const config = require('./../../../config');
const { startApi, stopApi } = require('../../../testing/context/api.js');
const { employeesRepo } = require('../../../models/repositories');
const builder = require('../../../testing/builders');
const auth = require('../../../testing/utils');

test.before(async t => {
    await startApi(t, require('./get-route.js'));

    const count = 20;
    const info = await addEmployees(20);

    t.context.info = info;
    t.context.employeeCount = count;
});

test.after(stopApi);

test('Search users as a manager should be successful', async t => {
    const { api, employeeCount } = t.context;

    const BODDepartment = {
        id: ObjectID(),
        ts: Date.now()
    };

    const manager = builder.createEmployee()
        .withEmail('test@gmail.com')
        .withDepartment(BODDepartment)
        .withRole(config.roles.manager)
        .build();

    const reply = await api.inject({
        method: 'GET',
        url: `/api/v1/users`,
        auth: auth.forUser(manager)
    });

    const items = _.get(reply, 'result.items');

    t.is(200, reply.statusCode);
    
    t.is(items.length, employeeCount);
});

test('Search users as a staff in specific department should be successful', async t => {
    const { api, info } = t.context;
    const { department_1, department_2, teamsOfDepartment1, teamsOfDepartment2 } = info;

    const ITDepartment = {
        ...department_1
    };

    const staff = builder.createEmployee()
        .withEmail('staff@gmail.com')
        .withDepartment(ITDepartment)
        .withRole(config.roles.staff)
        .build();
    
    const reply = await api.inject({
        method: 'GET',
        url: `/api/v1/users?department=${ITDepartment.id}`,
        auth: auth.forUser(staff)
    });

    t.is(200, reply.statusCode);
});

test.only('Search users as a staff in another department should be forbidden', async t => {
    const { api, info } = t.context;
    const { department_1, department_2 } = info;

    const ITDepartment = {
        ...department_1
    };

    const staff = builder.createEmployee()
        .withEmail('staff@gmail.com')
        .withDepartment(ITDepartment)
        .withRole(config.roles.staff)
        .build();
    
    const reply = await api.inject({
        method: 'GET',
        url: `/api/v1/users?department=${department_2.id}`,
        auth: auth.forUser(staff)
    });

    t.is(403, reply.statusCode);
});

async function addEmployees(count = 20) {
    const department_1 = {
        id: ObjectID(),
        ts: Date.now()
    };

    const department_2 = {
        id: ObjectID(),
        ts: Date.now()
    };

    const teamsOfDepartment1 = (()=> {
        const teams = [];
        for(let i = 1; i <= count/4; i++) {
            teams.push({
                id: ObjectID(),
                ts: Date.now()
            });
        }
        return teams;
    })();

    const teamsOfDepartment2 = (()=> {
        const teams = [];
        for(let i = 1; i <= count/4; i++) {
            teams.push({
                id: ObjectID(),
                ts: Date.now()
            });
        }
        return teams;
    })();

    const employees = [];
    for(let i = 1; i <= count; i++) {
        const employee = builder.createEmployee()
            .withEmail('staff@gmail.com')
            .withDepartment(i <= (count / 2) ? department_1: department_2)
            .withTeams(i <= (count / 2) ? teamsOfDepartment1: teamsOfDepartment2)
            .withRole(config.roles.staff)
            .build();

        employees.push(employee);
    }

    await employeesRepo.insertMany(employees);

    return {
        department_1,
        department_2,
        teamsOfDepartment1: teamsOfDepartment1.map(t => t.id),
        teamsOfDepartment2: teamsOfDepartment2.map(t => t.id),
    }
}