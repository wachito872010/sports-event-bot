'use strict';
const {Event} = require('@root/models');
const moment = require('moment');

function showWeekEvents(bot, update) {
  Event.thisWeek()
    .then(events => {
      let message = '';
      let date;
      events.filter(elem => {
        return !update.user.deniedTournaments.includes(elem.tournament._id);
      }).forEach(elem => {
        if (date !== moment(elem.date).subtract(3, 'hours').format('DD/MM')) {
          date = moment(elem.date).subtract(3, 'hours').format('DD/MM');
          message += `-------- ${moment(elem.date).subtract(3, 'hours').format('DD/MM')} --------\n`;
        }
        message += `${moment(elem.date).subtract(3, 'hours').format('HH:mm')} \n`;
        message += `${elem.name} \n`;
        message += `${elem.tournament.name} \n`;
        if (elem.tvInfo && elem.tvInfo.length > 0) {
          message += `${elem.tvInfo} \n\n`;
        } else {
          message += '\n';
        }
      });
      if (message === '') {
        message = 'No hay eventos.'
      }
      return bot.reply(update, message);
    })
    .catch(error => {
      console.error(`showWeekEvents error: ${error.message}`);
      return bot.reply(update, 'Me rompí');
    })
}

function controller(bot, update, next) {
  if (update.message.text === '/week') {
    return showWeekEvents(bot, update);
  }
  return next();
}

module.exports = controller;
