'use strict';

const siteConfig = require('../constants/' + process.env.NODE_ENV + '.json');
let siteUrl = null;
let twitterConfig = {};
let sfConfig = {};
module.exports = class SiteConfig {

    static init() {
    }

    static getPort() {
        return `${siteConfig.url.port}`;
    }
    static getRootURL() {
        return `${siteConfig.url.protocol}://${siteConfig.url.host}:${siteConfig.url.port}`;
    }
    
};