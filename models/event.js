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

module.exports = mongoose.model('Event', eventSchema);
