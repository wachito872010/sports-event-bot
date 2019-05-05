'use strict';
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  code: String,
  name: String,
  date: Date,
  tvInfo: String,
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  }
}, {
  timestamps: true
});

eventSchema.statics.thisWeek = function() {
  let today = new Date();
  today.setHours(3, 0, 0, 0);
  return this.find({
    date: {
      $gt: today
    }
  })
    .sort('date')
    .populate('tournament');
}

module.exports = mongoose.model('Event', eventSchema);
