const appRootPath = require('app-root-path');
const { winston, createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, prettyPrint, logstash } = format;
const date = new Date();
const logFileName = date.getFullYear() + '_' + (parseInt(date.getMonth()) + 1) + '_' + date.getDate();
const ignorePrivate = format((info, opts) => {
    if (info.private) { return false; }
    return info;
});
const errorLogFormat = prettyPrint(info => {
    return `\n[${info.timestamp}] [${info.level}]: ${info.message}`;
});
const logFormat = printf(info => {
    return `[${info.timestamp}] [${info.level}]: ${info.message}`;
});

const simpleLogFormat = printf(info => {
    return `${info.message}`;
});

const arrType = {
    'info': {
        'level': 'info',
        'name': 'info-file',
        'filename': `${appRootPath}/logs/${logFileName}_info_logs.log`,
        'format': combine(
            label({ label: 'error' }),
            timestamp(),
            logFormat
        )
    },
    'error': {
        'level': 'error',
        'name': 'error-info',
        'filename': `${appRootPath}/logs/${logFileName}_error_logs.log`,
        'format': combine(
            label({ label: 'error' }),
            timestamp(),
            errorLogFormat
        )
    },
    'debug': {
        'level': 'debug',
        'name': 'debug-info',
        'filename': `${appRootPath}/logs/${logFileName}_debug_logs.log`,
        'format': combine(
            label({ label: 'debug' }),
            timestamp(),
            errorLogFormat
        )
    },
    'simple': {
        'level': 'info',
        'name': 'error-info',
        'filename': `${appRootPath}/logs/${logFileName}_error_logs.log`,
        'format': combine(
            // label({ label: 'error' }),
            // timestamp(),
            simpleLogFormat
        )
    }
}

let infoLogger, debugLogger, errorLogger,simpleLogger;
infoLogger = createLogger({
    'transports': [
        new transports.File(arrType['info']),
    ],
    'exceptionHandlers': [
        new transports.File({
            filename: `${process.env.LOG_PATH}${logFileName}_exceptions.log`
        })
    ],
    'exitOnError': false
});
debugLogger = createLogger({
    'transports': [
        new transports.File(arrType['debug']),
    ],
    'exceptionHandlers': [
        new transports.File({
            filename: `${process.env.LOG_PATH}${logFileName}_exceptions.log`
        })
    ],
    'exitOnError': false
});
errorLogger = createLogger({
    'transports': [
        new transports.File(arrType['error']),
    ],
    'exceptionHandlers': [
        new transports.File({
            filename: `${process.env.LOG_PATH}${logFileName}_exceptions.log`
        })
    ],
    'exitOnError': false
});

simpleLogger = createLogger({
    'transports': [
        new transports.File(arrType['simple']),
    ],
    'exceptionHandlers': [
        new transports.File({
            filename: `${process.env.LOG_PATH}${logFileName}_exceptions.log`
        })
    ],
    'exitOnError': false
});

/**
 * @description export final logger function expression
 */
module.exports = ({
    info(info) {
        infoLogger.info(info);
    },
    debug(info) {
        infoLogger.debug(info);
    },
    error(err) {
        errorLogger.error(err);
    },
    simple(err) {
        simpleLogger.info(err);
    }
});