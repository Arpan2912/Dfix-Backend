"use strict";

const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const express = require('express');
// const shrinkRay = require('shrink-ray');
const compression = require('compression');

module.exports = class RouteConfig {
    static init(app) {
        let _qroot = process.cwd();
        console.log("_qroot", _qroot);
        app.use(compression());
        app.use(express.static('public'));
        // app.use(express.static(_qroot + '\public'));
        app.use(morgan('dev'));
        app.set('etag', false);
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'ejs');
        // app.use(shrinkRay());
        app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
        app.use(bodyParser.json({ limit: '10mb' }));
        app.use(helmet());
    }

    static last(app) {
        // Since this is the last non-error-handling
        // middleware use() d, we assume 404, as nothing else responded.

        app.use(function (req, res, next) {
            res.status(404);

            // respond with html page
            if (req.accepts('html')) {
                res.render('404', { url: req.url });
                return;
            }

            // respond with json
            if (req.accepts('json')) {
                res.send({ error: 'JSON not found' });
                return;
            }

            // default to plain-text. send()
            res.type('txt').send('Not found');
        });
    }
}