'use strict'

var loggly = require('../loggly');

var winston = require('winston'),
    expressWinston = require('express-winston');
require('winston-loggly');

var consoleTransport = new winston.transports.Console({
      json: false,
      colorize: true,
      timestamp: true,
      level: process.env.LOGLEVEL || 'info'
})

var logglyTransport = new winston.transports.Loggly({
    inputToken: loggly.config.inputToken,
    subdomain: loggly.config.subdomain,
    tags: loggly.config.tags,
    json:true,
    timestamp: true,
    level: loggly.config.loglevel
});

var localTransports = [
  consoleTransport
]

var logglyTransports = [
  consoleTransport,
  logglyTransport
]

var transports = loggly.config.enabled ? logglyTransports : localTransports;


module.exports = new winston.Logger({
  transports: transports
});

module.exports.expressMiddlewareErrorLogger = expressWinston.errorLogger({
  transports: transports
});

module.exports.expressMiddlewareLogger = expressWinston.logger({
  transports: transports,
  level: "info",
  meta: true
});
