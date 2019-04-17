'use strict';
require('dotenv').config();
const updateData = require('./utils/update-data');
const schedule = require('./utils/schedule');

function connectMongoose() {
    const mongoose = require('mongoose');
    mongoose.Promise = Promise;
    return mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB, {useNewUrlParser: true});
}

return connectMongoose()
    .then(() => {
        return schedule();
    })
    .catch((error) => {
        console.error(`PROCESS ERROR: ${error.message}`);
        process.exit(1);
    });
