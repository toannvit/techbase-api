'use strict';
const EmployeeBuilder = require('./employees.js');

exports.createEmployee = () => {
    return new EmployeeBuilder();
};
