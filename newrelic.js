'use strict'

/**
* New Relic module configuration
*
* For more information
* a default configuration file can be found in
* node_modules/newrelic/lib/config.default.js
*
*/


exports.config = {
  app_name: [
    // npm adds this env var from the package.json
    process.env.NODE_ENV + '-' + process.env.npm_package_name
  ],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || '',
  agent_enabled: process.env.NEW_RELIC_ENABLED || false,
  /**
   * The default Apdex tolerating / threshold value for applications, in
   * seconds. The default for Node is apdexT to 100 milliseconds, which is
   * lower than New Relic standard, but Node.js applications tend to be more
   * latency-sensitive than most.
   *
   * @env NEW_RELIC_APDEX
   */
  apdex_t: 0.100,
  /**
   * Whether to capture parameters in the request URL in slow transaction
   * traces and error traces. Because this can pass sensitive data, it's
   * disabled by default. If there are specific parameters you want ignored,
   * use ignored_params.
   *
   * @env NEW_RELIC_CAPTURE_PARAMS
   */
  capture_params: false,
  /**
   * Array of parameters you don't want captured off request URLs in slow
   * transaction traces and error traces.
   *
   * @env NEW_RELIC_IGNORED_PARAMS
   */
  ignored_params: [],
  logging: {
    level: 'error',
    filepath: require('path').join(process.cwd(), 'newrelic_agent.log'),
    /**
     * Whether to write to a log file at all
     *
     * @env NEW_RELIC_LOG_ENABLED
     */
    enabled: false
  },
  error_collector: {
    enabled: true,
    /**
     * List of HTTP error status codes the error tracer should disregard.
     * Ignoring a status code means that the transaction is not renamed to
     * match the code, and the request is not treated as an error by the error
     * collector.
     *
     * Defaults to 404 NOT FOUND.
     *
     * @env NEW_RELIC_ERROR_COLLECTOR_IGNORE_ERROR_CODES
     */
    ignore_status_codes: [401, 404],
    /**
     * Whether error events are collected.
     */
    capture_events: true,
    max_event_samples_stored: 100
  },
  utilization: {
    detect_aws: false,
    detect_docker: true
  },
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f',
    top_n: 20,
    record_sql: 'off',
    explain_threshold: 500
  },
  debug: {
    internal_metrics: false,
    tracer_tracing: false
  },
  /**
   * Rules for naming or ignoring transactions.
   */
  rules: {
    /**
     * A list of rules of the format {pattern: 'pattern', name: 'name'} for
     * matching incoming request URLs and naming the associated New Relic
     * transactions. Both pattern and name are required. Additional attributes
     * are ignored. Patterns may have capture groups (following JavaScript
     * conventions), and names will use $1-style replacement strings. See
     * the documentation for addNamingRule for important caveats.
     *
     * @env NEW_RELIC_NAMING_RULES
     */
    name: [],
    /**
     * A list of patterns for matching incoming request URLs to be ignored by
     * the agent. Patterns may be strings or regular expressions.
     *
     * @env NEW_RELIC_IGNORING_RULES
     */
    ignore: []
  },
  enforce_backstop: true,
  browser_monitoring: {
    /**
     * Enable browser monitoring header generation.
     *
     * This does not auto-instrument, rather it enables the agent to generate headers.
     * The newrelic module can generate the appropriate <script> header, but you must
     * inject the header yourself, or use a module that does so.
     *
     * Usage:
     *
     *     var newrelic = require('newrelic');
     *
     *     router.get('/', function (req, res) {
     *       var header = newrelic.getBrowserTimingHeader();
     *       res.write(header)
     *       // write the rest of the page
     *     });
     *
     * This generates the <script>...</script> header necessary for Browser Monitoring
     * This script must be manually injected into your templates, as high as possible
     * in the header, but _after_ any X-UA-COMPATIBLE HTTP-EQUIV meta tags.
     * Otherwise you may hurt IE!
     *
     * This method must be called _during_ a transaction, and must be called every
     * time you want to generate the headers.
     *
     * Do *not* reuse the headers between users, or even between requests.
     *
     * @env NEW_RELIC_BROWSER_MONITOR_ENABLE
     */
    enable: true,

    /**
     * Request un-minified sources from the server.
     *
     * @env NEW_RELIC_BROWSER_MONITOR_DEBUG
     */
    debug: false
  },
  /**
   * Transaction Events
   *
   * Transaction events are sent to New Relic Insights. This event data
   * includes transaction timing, transaction name, and any custom parameters.
   *
   * Read more here: http://newrelic.com/insights
   */
  transaction_events: {
    /**
     * If this is disabled, the agent does not collect, nor try to send,
     * analytic data.
     */
    enabled: true,

    /**
     * The agent will collect all events up to this number per minute. If
     * there are more than that, a statistical sampling will be collected.
     */
    max_samples_per_minute: 10000,

    /**
     * This is used if the agent is unable to send events to the collector.
     * The values from the previous harvest cycle will be merged into the next
     * one with this option as the limit.
     *
     * This should be *greater* than max_samples_per_minute or you'll see odd
     * behavior. You probably want at least double the value, but more is okay
     * as long as you can handle the memory overhead.
     */
    max_samples_stored: 20000
  },

  /**
   * Custom Insights Events
   *
   * Custom insights events are JSON object that are sent to New Relic
   * Insights. You can tell the agent to send your custom events via the
   * `newrelic.recordCustomEvent()` API. These events are sampled once the max
   * reservoir size is reached. You can tune this setting below.
   *
   * Read more here: http://newrelic.com/insights
   */
  custom_insights_events: {
    /**
     * If this is disabled, the agent does not collect, nor try to send, custom
     * event data.
     */
    enabled: true,
    max_samples_stored: 1000
  },
  /**
   * This is used to configure properties about the user's host name.
   */
  process_host: {
    display_name: '',
    ipv_preference: '4'
 },
  /**
   * High Security
   *
   * High security mode (v2) is a setting which prevents any sensitive data from
   * being sent to New Relic. The local setting must match the server setting.
   * If there is a mismatch the agent will log a message and act as if it is
   * disabled.
   *
   * Attributes of high security mode (when enabled):
   *  * requires SSL
   *  * does not allow capturing of http params
   *  * does not allow custom params
   *
   * To read more see: https://docs.newrelic.com/docs/subscriptions/high-security
   */
  high_security: false,
  /**
   * Labels
   *
   * An object of label names and values that will be applied to the data sent
   * from this agent. Both label names and label values have a maximum length of
   * 255 characters. This object should contain at most 64 labels.
   */
  labels: {
    app: process.env.NODE_APP,
    environment: process.env.NODE_ENV || 'development',
    container: process.env.HOSTNAME || os.hostname,
    version: process.env.VERSION || '',
    build_date: process.env.BUILD_DATE || '',
  },
  slow_sql: {
    enabled: false,
    max_samples: 10
  }
}
