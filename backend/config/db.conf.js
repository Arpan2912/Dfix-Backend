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
            mongoose.connect(`mongodb://${dbConst.host}:${dbConst.port}/${dbConst.db}`, {

                autoReconnect: true
            }).then(con => {
                mongoConnection = mongoose.connection;
                mongoConnection.once('open', function () {
                    console.log('connected to mongodb database');
                });

                mongoConnection.on('reconnect', () => {
                    console.log("connection reconnect");
                })
                mongoConnection.on('disconnected', () => {
                    console.log("connection disconnected");
                    // mongoConnection.emit('reconnect');
                })

               
                mongoConnection.on('connected', function (ref) {
                    global.mongo_conn=true;
                    console.log('Connected connection to mongo server.');
                });
                
                
                mongoConnection.on('disconnect', function (err) {
                    console.log('Error...disconnect', err);
                });
                mongoConnection.on('connecting', function (ref) {
                    // connected = false;
                    console.log('connecting.');
                });
                
                mongoConnection.on('close', function (ref) {
                    // global.mongo_conn=false;
                    console.log('close connection.');
                    connect();
                });
                
                mongoConnection.on('error', function (ref) {
                    connected = false;
                    console.log('Error connection.');
                    //mongoConnection.disconnect();
                    // global.mongo_conn=false;
                });
                
                mongoConnection.on('reconnected', function () {
                    // global.mongo_conn=true;
                    console.log('MongoDB reconnected!');
                });
               

                
            }).catch(e => {
                console.log("e", e);
            })

            // mongoose.connect(`mongodb://${dbConst.host}:${dbConst.port}/${dbConst.db}`)
            //     .then(con => {
            //         mongoConnection = con;
            //         mongoConnection = mongoose.connection;
            //         mongoConnection.on('error', function (error) {

            //             //console.error.bind(console, 'error connecting with mongodb database:');

            //         });

            //         mongoConnection.once('open', function () {
            //             console.log('connected to mongodb database');
            //         });


            //         mongoConnection.on('disconnected', function () {
            //             //Reconnect on timeout
            //             //mongoose.connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME);

            //             mongoose.connect(`mongodb://${dbConst.host}:${dbConst.port}/${dbConst.db}`, {
            //                 // server: {
            //                     poolSize: 50,
            //                     auto_reconnect: true,
            //                     // socketOptions: {
            //                     //     //socketTimeoutMS: 900000,
            //                     //     socketTimeoutMS: 0,
            //                     //     connectTimeoutMS: 0,
            //                     //     "reconnectTries": 100,
            //                     //     "reconnectInterval": 1000
            //                     //     //connectionTimeout: 30000,
            //                     //     //keepAlive: 300000
            //                     // }
            //                 // }
            //             }).then(con => {
            //                 mongoConnection = con;
            //                 mongoConnection = mongoose.connection;
            //             }).catch(e => {

            //             })
            //             // mongoConnection = mongoose.connection;
            //         });
            //     }).catch(e => {
            //         console.error(e);
            //     })
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