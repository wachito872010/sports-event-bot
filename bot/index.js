'use strict';
const Botmaster = require('botmaster');
const TelegramBot = require('botmaster-telegram');
const SessionWare = require('botmaster-session-ware');
const {User} = require('../models');
const configTournaments = require('./config-tournaments');
const weekEvents = require('./week-events');

const botmaster = new Botmaster();
botmaster.addBot(new TelegramBot({
  credentials: {
    authToken: process.env.TELEGRAM_BOT_TOKEN,
  },
  webhookEndpoint: '/webhookIhLjl/',
}));
const sessionWare = SessionWare();
botmaster.useWrapped(sessionWare.incoming, sessionWare.outgoing);

function init() {
  botmaster.use({
    type: 'incoming',
    name: 'User info',
    controller: (bot, update, next) => {
      User.findOrCreate(update.sender.id)
        .then((user) => {
          update.user = user;
          return next();
        })
        .catch(error => {
          console.error(`User info error: ${error.message}`);
          return bot.reply(update, 'Me rompí');
        });
    }
  });

  botmaster.use({
    type: 'incoming',
    name: '/test',
    controller: (bot, update, next) => {
      if (update.message.text !== '/test') {
        return next();
      }
      const btnOptions = ['Opcion 1', 'Opcion 2'];
      console.log(btnOptions);
      console.log(update.sender.id);
      return bot.sendDefaultButtonMessageTo(btnOptions, 'Seleccione una opcion:', update.sender.id)
      // return bot.sendTextCascadeTo(['Hi there, I`m about to ask you to press buttons:',
      //   'Please press any of: ["Button1","Button2"]',
      //   'Thank you'], update.sender.id)
        .catch(error => {
          console.error(`/test error: ${error.message}`);
          return bot.reply(update, 'Me rompí');
        });
    }
  });

  botmaster.use({
    type: 'incoming',
    name: 'Week events',
    controller: weekEvents
  });

  botmaster.use({
    type: 'incoming',
    name: 'Config Tournaments',
    controller: configTournaments
  });
}

module.exports = init;
