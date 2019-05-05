FROM node:8.15.0-alpine

RUN npm config set registry http://registry.npmjs.org && npm cache verify

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install --unsafe-perm && npm cache verify

COPY . /usr/src/app

RUN rm -rf .env && touch .env

CMD [ "npm", "start" ]
