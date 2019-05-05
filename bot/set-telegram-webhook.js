'use strict';
const request = require('request-promise');

function setTelegramWebhook() {
  console.log(`${process.env.EXTERNAL_URL}${process.env.TELEGRAM_BOT_WEBHOOK_PATH}/`);
  return request({
    uri: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`,
    body: {
      url: `${process.env.EXTERNAL_URL}${process.env.TELEGRAM_BOT_WEBHOOK_PATH}/`
    },
    json: true
  })
    .then((res) => {
      console.log(res);
    });
}

module.exports = setTelegramWebhook;
