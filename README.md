#Building a Nodejs Express app for the Enterprise

This is for those intending to run a node container with the Express web framework in an enterprise setting. What I mean by enterprise setting is that development will be done locally, on a developer's machine and the source code is hooked into a CICD (Continuous Integration Continuous Delivery) system that will deliver a containerized app to a registry for deployment to a staging environment for Quality Assurance before shipping to production for public consumption.


1. Logging and monitoring of app performance so that we can gather data about the apps performance and document any bugs found with actual data to tell us how it is produced.
2. Developers developing locally; Docker allows us to verify that our code will run in the same manner when deployed to staging and production environments.
3. Keep your configurations out of your app, it's not safe there.


1.1 [NewRelic](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration), you can use your own api key and see the request results when running this container. This way, performance and uptime monitoring is easy to enable just by providing your key and setting NEW_RELIC_ENABLE to true.

This [newrelic.js]() file sets up it's configuration via variables when required by app.js:
    ```javascript
    exports.config = {
    app_name: [
      // npm adds this env var from the package.json
      process.env.NODE_ENV + '-' + process.env.npm_package_name
    ],
    license_key: process.env.NEW_RELIC_LICENSE_KEY || '',
    agent_enabled: process.env.NEW_RELIC_ENABLED || false,

    ...
    ```

1.2 [Loggly](https://www.loggly.com/ultimate-guide/node-logging-basics/), again you can use your own key to enable. When disabled logging is still sent to stdout.

The logging configuration is set by [loggly.js]() that is imported into [lib/logger.js](). When [app.js]() requires lib/logger, this line is responsible for determining the different ways to ship logs.

```javascript
var transports = loggly.config.enabled ? logglyTransports : localTransports;
```
If Loggly is enabled use logglyTransports, else use localTransports.


3.1 Configuration management, I commonly see node developers doing some sort of evaluation of the NODE_ENV value and storing different app configurations in separate files to be melded together upon startup. That works but I recommend steering clear, of course I do I am a DevOps Engineer.

Containers are transient in nature. You'll hear that a lot when discussing this technology. With Docker Orchestration tools like [Kubernetes by Google](http://kubernetes.io/) and [Helios by Spotify](https://github.com/spotify/helios), your configurations should be applied in the environment the container lives.

The [Twelve-Factor App]("http://12factor.net/") clearly documents the usefulness of this, in summary:

  - As an administrator of the staging and production environments there will be some differences between them. At minimum, database credentials and endpoints, possibly log levels, and others all of which I will provide your container via environment variables.

  This allows us to store configuration externallly of your repository and properly safeguard any secrets with encryption. Configuration management such as Ansible, Chef, and Puppet will deliver changes to those environment variables.

  - As a developer, I can verify my code locally and work independently of external services. Need Redis and or MongoDB ? No problem, remember how we use variables to control the app? Link a container to the app's container and set the environment variables and you're good to go. Safe from manipulating data stored in an external service other teams require integrity with!

  Docker makes this as simple as: `docker-compose up`

  ... and the docker-compose.yml looks like:

  ```yaml
nodejs-express:
    image: node:6
    working_dir: /root/nodejs-express
    environment:
        - NODE_ENV=development
        - MONGODB_ENDPOINT=mongo_db
        - NEW_RELIC_LOG_LEVEL=info
        - NEW_RELIC_LICENSE_KEY=WU9VUl9ORVdfUkVMSUNfTElDRU5TRV9LRVk=
        - LOGGLY_SUBDOMAIN=your-subdomain
        - LOGGLY_TOKEN=WU9VUl9MT0dHTFlfVE9LRU4=
    links:
        - mongo_db
    volumes:
        - ${PWD}:/root/nodejs-express
    ports:
        - 80:3000
    entrypoint:
        - npm
        - run
        - start-local

mongo_db:
    image: mongo:latest

  ```

## In Summary:

  1. Logging and performance metrics are not just your Administrator's responsibility. They are paramount when bugs need a good bashin in a timely fashion!
  2. Use Docker to minimize the difference between the location where an app begins life, where it matures, and where it serves your product to your clients
  3. Please! Use configuration management to secure and deploy your configurations. Design your app with the Twelve-Factor guidelines for a better workflow.


I look forward to hearing your comments and hope the code samples can help you achieve a well performing and easily maintainable application.
