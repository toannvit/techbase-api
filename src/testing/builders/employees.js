'use strict';

const Builder = require('./builder');
const { ObjectID }= require('mongodb');

module.exports = class EmployeeBuilder extends Builder {
    createBase() {
        return {
            _id: ObjectID(),
            name: {
                f: 'firsName',
                l: 'lastName'
            }
        };
    }

    withEmail(email) {
        this.with('email', email);
        return this;
    }

    withRole(role) {
        this.with('role', role);
        return this;
    }

    withDepartment(department) {
        this.with('department', department);
        return this;
    }

    withTeams(teams) {
        this.with('teams', teams);
        return this;
    }
};
