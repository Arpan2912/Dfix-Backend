'use strict';
const os = require('os');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const dbConfig = require('./config/db.conf');
const siteConfig = require('./config/site.conf');
const routesConfig = require('./config/routes.conf');
const events = require('events').EventEmitter.prototype._maxListeners = 100;
const routes = require('./routes/index');
let origin;

dbConfig.init();
// siteConfig.init();
routesConfig.init(app);

// Middleware that will create a connection to the database
app.use(dbConfig.createConnection);

// Add headers to allow Cross-Origin Resource Sharing
app.get("/uploads/*", function (request, response, next) {
    origin = request.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        response.setHeader('Access-Control-Allow-Origin', origin);
    }
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    response.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use("/api/*", function (request, response, next) {
    console.log("token", request.headers);
    // origin = request.headers.origin;
    // if (allowedOrigins.indexOf(origin) > -1) {
    //response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Origin', '*');
    // Set to true if you need the website to include cookies in the requests sent
    //response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // response.header('Access-Control-Allow-Headers', request.headers['access-control-request-headers']);
    response.header('Access-Control-Allow-Headers', '*');
    response.header('Access-Control-Allow-Credentials', true);
    next();
});

var server = http.listen(siteConfig.getPort(), () => {
    console.log("Service is running on ", siteConfig.getRootURL());

});

// const io = require('socket.io')(server);
routes.init(app, express.Router());

// Middleware to close a connection to the database
app.use(dbConfig.closeConnection);

/**
 * NodeJS process management
 */
// process.setMaxListeners(0);