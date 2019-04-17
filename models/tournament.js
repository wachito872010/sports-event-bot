'use strict';
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  code: String,
  name: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Tournament', tournamentSchema);
