"use strict";

const expressJwt = require('express-jwt');
const fs = require("fs");
const path = require("path");
const authConfig = require('../config/secret.conf');
const dbConfig = require('../config/db.conf');

/* REST */
// const AuthenticationRoutes = require('../api/authentication/routes/authentication-routes');
    const UserRoutes = require('../api/user/user-routes');
/* Commons */
// const StaticDispatcher = require('../commons/static/index');

module.exports = class Routes {
    static init(app, router) {
        /**
         * @description There are some url (uploads media) requires to bypass authentication.
         * Following code allow to bypass authentication..
         * API validation (Except: AuthenticationRoutes)
         */
        // var allowAccess = expressJwt({
        //     secret: authConfig.secret,
        // }).unless({
        //     path: [
        //         '/uploads/*'
        //     ]
        // });
        // app.all(["/api/*"], allowAccess);

        /**
         * @description Following route allows to access user photos uploaded by user
         */
        app.get("/uploads/*", function (req, res, next) {
            var avatar = __dirname + "/../.." + req.url;
            var fname = path.basename(avatar);
            var fExtension = fname.split(".")[1];
            var arrExtensions = { 'png': 'image/png', 'jpeg': 'image/jpeg', jpg: 'image/jpeg', 'gif': 'image/gif' };
            if (true === fs.existsSync(avatar)) {
                var img = fs.readFileSync(avatar);
                res.writeHead(200, { 'Content-Type': arrExtensions[fExtension] });
                res.end(img, 'binary');
            }
        });

        /* REST Routes */
        UserRoutes.init(router);

        // router
        //     .route('/push')
        //     .get(TestPushDispatcher.pushNoti);

        // router
        //     .route('*')
        //     .get(StaticDispatcher.sendIndex);

        app.use('/', router);
    }
}