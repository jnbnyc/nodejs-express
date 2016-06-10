/**
* Configuration
* 
*
*
*/

var newrelic = require('./newrelic');
var loggly = require('./loggly')
 
module.exports = {
  newrelic: newrelic.config,
  loggly: loggly.config
}