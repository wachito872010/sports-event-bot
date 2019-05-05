'use strict';
const request = require('request-promise');

function setTelegramWebhook() {
  return request.post(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`,
    {
      url: `${process.env.EXTERNAL_URL}/${process.env.TELEGRAM_BOT_WEBHOOK_PATH}/`
    }
  );
}

module.exports = setTelegramWebhook;
