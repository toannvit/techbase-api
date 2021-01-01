'use strict';

exports.forUser = user => {
    return {
        strategy: 'jwt',
        credentials: {
            id: String(user._id),
            email: user.email,
            role: user.role,
            departmentId: String(user.department.id)
        }
    };
};
