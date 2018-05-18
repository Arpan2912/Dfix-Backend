//write db configuration here

"use strict";
const dbConst = require('../constants/' + process.env.NODE_ENV + '.json').database;
const mongoose = require('mongoose');
var mongoConnection = null;

module.exports = class DBConfig {

    static init() {
        if (true === !!mongoConnection) {
            next();
        } else {
            console.log(JSON.stringify(dbConst));
            mongoose.connect(`mongodb://${dbConst.host}:${dbConst.port}/${dbConst.db}`)
                .then(con => {
                    mongoConnection = con;
                    mongoConnection = mongoose.connection;
                    mongoConnection.on('error', function (error) {

                        //console.error.bind(console, 'error connecting with mongodb database:');

                    });

                    mongoConnection.once('open', function () {
                        console.log('connected to mongodb database');
                    });


                    mongoConnection.on('disconnected', function () {
                        //Reconnect on timeout
                        //mongoose.connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME);

                        mongoose.connect(`mongodb://${dbConst.host}:${dbConst.port}/${dbConst.db}`, {
                            // server: {
                                poolSize: 50,
                                auto_reconnect: true,
                                // socketOptions: {
                                //     //socketTimeoutMS: 900000,
                                //     socketTimeoutMS: 0,
                                //     connectTimeoutMS: 0,
                                //     "reconnectTries": 100,
                                //     "reconnectInterval": 1000
                                //     //connectionTimeout: 30000,
                                //     //keepAlive: 300000
                                // }
                            // }
                        }).then(con => {
                            mongoConnection = con;
                            mongoConnection = mongoose.connection;
                        }).catch(e => {

                        })
                        // mongoConnection = mongoose.connection;
                    });
                }).catch(e => {
                    console.error(e);
                })
        }


    }



    static createConnection(req, res, next) {
        if (true === !!mongoConnection) {
            req.mConnection = mongoConnection;
            next();
        } else {

        }
    }

    static closeConnection(req, res, next) {

        // req._rdbConn.close();
        // rConnection.close();
    }

    static handleError(res) {
        return function (error) {
            res.status(500).send(error.message);
        };

    }

    static mConnection() {
        return mongoConnection;
    }
};