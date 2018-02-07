'use strict';
if (process.env.NODE_ENV === 'production') {
    console.log('inside production url');
    // require('newrelic');
}

if (false === !!process.env.NODE_ENV) {
    console.log('Environment variable is not set. Trying running it from index.js');
    process.env.NODE_ENV = 'development';
}

global._root = process.cwd() + '/backend';
require("./cluster");


// const express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
// // app.use(bodyParser.json());
// app.use(bodyParser.json({ limit: '10mb' }))
// // respond with "hello world" when a GET request is made to the homepage
// app.use("*", function (request, response, next) {
//     // origin = request.headers.origin;
//     // if (allowedOrigins.indexOf(origin) > -1) {
//         // console.log(request);
//          response.setHeader('Access-Control-Allow-Origin', '*');
//      //}
//      // Set to true if you need the website to include cookies in the requests sent
//      //response.header('Access-Control-Allow-Origin', '*');
//      response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//      response.header('Access-Control-Allow-Headers','*');
//      //response.header('Access-Control-Allow-Headers','*');
//      response.header('Access-Control-Allow-Credentials', true);
//      next();
//  });

// app.post('/', function (req, res) {
//     console.log("req.body",JSON.stringify(req.body));
//   res.send('hello world');
// });

// app.listen(3000, () => console.log('Example app listening on port 3000!'))