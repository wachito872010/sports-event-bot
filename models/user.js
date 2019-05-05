'use strict';
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  deniedTournaments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  }]
}, {
  timestamps: true
});

userSchema.statics.findOrCreate = function(code) {
  return this.findOne({
    code
  })
    .then((user) => {
      if (!user) {
        return this.create({
          code
        });
      }
      return user;
    })
}

module.exports = mongoose.model('User', userSchema);
