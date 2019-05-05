'use strict';
const Botmaster = require('botmaster');
const TelegramBot = require('botmaster-telegram');
const SessionWare = require('botmaster-session-ware');
const {User} = require('../models');
const configTournaments = require('./config-tournaments');
const weekEvents = require('./week-events');
const setTelegramWebhook = require('./set-telegram-webhook');

const botmaster = new Botmaster({
  port: process.env.BOTMASTER_PORT
});
botmaster.addBot(new TelegramBot({
  credentials: {
    authToken: process.env.TELEGRAM_BOT_TOKEN,
  },
  webhookEndpoint: `/${process.env.TELEGRAM_BOT_WEBHOOK_PATH}/`,
}));
const sessionWare = SessionWare();
botmaster.useWrapped(sessionWare.incoming, sessionWare.outgoing);
setTelegramWebhook();

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
