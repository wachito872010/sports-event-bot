'use strict';
const schedule = require('node-schedule');
const updateData = require('./update-data');

function initSchedule() {
  schedule.scheduleJob('3 */1 * *', () => {
    updateData();
  });
}

module.exports = initSchedule;
