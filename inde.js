'use strict';
require('dotenv').config();
require('module-alias/register');
const schedule = require('./data-loader/schedule');
const bot = require('./bot/index');

function connectMongoose() {
    const mongoose = require('mongoose');
    mongoose.Promise = Promise;
    return mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB, {useNewUrlParser: true});
}

return connectMongoose()
    .then(() => {
        schedule();
        bot();
    })
    .catch((error) => {
        console.error(`PROCESS ERROR: ${error.message}`);
        process.exit(1);
    });
