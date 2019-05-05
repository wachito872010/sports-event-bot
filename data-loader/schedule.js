'use strict';
const schedule = require('node-schedule');
const updateData = require('./update-data');

function initSchedule() {
  updateData();
  schedule.scheduleJob('3 */1 * *', () => {
    updateData();
  });
}

module.exports = initSchedule;
