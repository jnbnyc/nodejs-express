'use strict'

exports.config = {
  enabled: process.env.LOGGLY_ENABLED || false,
  // options are > { silly: 0, debug: 1, verbose: 2, info: 3, warn: 4, error: 5 }
  loglevel: process.env.LOGGLY_LOGLEVEL || process.env.LOGLEVEL || "info",
  subdomain: process.env.LOGGLY_SUBDOMAIN || '',
  inputToken: process.env.LOGGLY_TOKEN || '',
  tags: [
    process.env.HOSTNAME || require('os').hostname,
    // npm adds this env var from the package.json
    process.env.npm_package_name,
    process.env.NODE_ENV || 'development'
  ]
}