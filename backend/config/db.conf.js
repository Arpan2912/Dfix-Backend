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
            .then(con=>{
                mongoConnection = con;
            }).catch(e=>{
                console.error(e);
            })
        }
    }

    static createConnection(req, res, next) {
        if (true === !!mongoConnection) {
            req.mConnection =mongoConnection;
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