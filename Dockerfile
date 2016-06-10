FROM node:6-slim

ENV APP_NAME=nodejs-express

ADD .npmrc /root/
RUN mkdir -pv /root/${APP_NAME}

ADD bin /root/${APP_NAME}/bin/
ADD config /root/${APP_NAME}/config/
ADD lib /root/${APP_NAME}/lib/
ADD node_modules /root/${APP_NAME}/node_modules/
ADD public /root/${APP_NAME}/public/
ADD routes /root/${APP_NAME}/routes/
ADD views /root/${APP_NAME}/views

ADD package.json *.js *.sh /root/${APP_NAME}/

ENTRYPOINT /root/${APP_NAME}/entrypoint.sh
