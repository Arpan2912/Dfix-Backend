"use strict";

const expressJwt = require('express-jwt');
const fs = require("fs");
const path = require("path");

const key = require('../config/secret.conf');
const dbConfig = require('../config/db.conf');

/* REST */
const UserRoutes = require('../api/user/user-routes');
const AuthenticationRoutes = require('../api/authenticate/authenticate-routes');
const StartStopDayRouter = require('../api/start-stop-day/start-stop-day-router');
const StartStopVisitRouter = require('../api/start-stop-visit/start-stop-visit-routes');
const ExpenseRouter = require('../api/expense/expense-routes');
const LocationRouter = require('../api/location/location-routes');

/* Commons */
// const StaticDispatcher = require('../commons/static/index');

module.exports = class Routes {
    static init(app, router) {
        /**
         * @description There are some url (uploads media) requires to bypass authentication.
         * Following code allow to bypass authentication..
         * API validation (Except: AuthenticationRoutes)
         */
        var allowAccess = expressJwt({
            secret: key.secret,
        }).unless({
            path: [
                '/uploads/*',
                '/api/login',
                '/api/update-user',
                '/api/get-user-by-email',
                '/api/get-user-by-phone',
                '/api/add-user', // this will be removed from here in future
                '/api/stop-visit',
        		'/api/get-today-expense',
        		'/api/add-expense',
                '/api/start-day',
                '/api/getExpense',
                '/api/update-expense',
                '/api/admin',
                '/api/delete-expense',
                '/api/stop-day',
                '/api/get-day-summary',
                '/api/get-today-visits',
                '/api/update-order-web'

            ]
        });

        app.all(["/api/*"], allowAccess);

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
        AuthenticationRoutes.init(router);
        StartStopDayRouter.init(router);
        StartStopVisitRouter.init(router);
        ExpenseRouter.init(router);
        LocationRouter.init(router);

        app.use('/', router);
    }
}
