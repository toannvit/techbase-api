const { employeesRepo } = require('../repositories');

exports.findEmployees = (query, options = {}) => {
    return Promise.all([
        employeesRepo.find(query, options),
        employeesRepo.countDocuments(query),
    ]);
}

exports.findUser = (query, options = {}) => {
    return employeesRepo.findOne(query, options);
}
