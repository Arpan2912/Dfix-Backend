const AuthenticationController = require('../../api/authenticate/authenticate-controller');
module.exports = class AuthenticationRoute {
    static init(router) {
        // router
        //     .route('/api/login')
        //     .post(AuthenticationController.authenticateUser);
            //login api
          router
          .route('/api/admin')
          .post(AuthenticationController.authenticateAdmin);
    }
}
