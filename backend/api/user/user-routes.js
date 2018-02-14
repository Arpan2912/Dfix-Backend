const UserController = require('./user-controller');
module.exports = class UserRoutes {
    static init(router) {

        router
            .route('/api/add-user')
            .post(UserController.addUser);

        router
            .route('/api/update-user')
            .post(UserController.updateUser);

        router
            .route('/api/user')
            .get(UserController.getAllUser);

        router
            .route('/api/delete-user')
            .post(UserController.deleteUser);
    }
}