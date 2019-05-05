'use strict';
const {Tournament} = require('../models');

function showDeniedTournaments(bot, update) {
  update.session.status = 'config_tournaments';
  update.session.substatus = 'list';
  Tournament.find()
    .then((tournaments) => {
      let message = 'TORNEOS SIN INTERÉS:\n';
      let denied = tournaments.filter((elem) => {
        return update.user.deniedTournaments.indexOf(elem._id.toString()) >= 0;
      });
      if (denied.length === 0) {
        message += 'No hay torneos en la lista\n';
      } else {
        denied.forEach((elem) => {
          message += `- ${elem.name}\n`;
        });
      }
      message += '\nPara agregar un torneo a la lista envíe /deny_tournament';
      message += '\nPara sacar un torneo de la lista envíe /allow_tournament';
      return bot.reply(update, message);
    })
    .catch((error) => {
      console.error(`showDeniedTournaments error: ${error.message}`);
      return bot.reply(update, 'Me rompí');
    });
}

function showListToDenyTournament(bot, update) {
  update.session.status = 'deny_tournament';
  Tournament.find({
    _id: {
      $nin: update.user.deniedTournaments
    }
  })
    .sort('name')
    .limit(9)
    .skip((update.session.page - 1) * 8)
    .then((tournaments) => {
      if (tournaments.length === 0) {
        return bot.reply(update, 'No hay torneos para agregar a la lista\n');
      }
      const btnOptions = [];
      tournaments.forEach((elem) => {
        btnOptions.push(elem.name);
      });
      if (tournaments.length === 9) {
        btnOptions.pop();
        if (update.session.page > 1) {
          btnOptions.push('Ver menos...');
        }
        btnOptions.push('Ver mas...');
      }
      return bot.sendDefaultButtonMessageTo(btnOptions, 'Seleccione un torneo para agregar a la lista:', update.sender.id)
    })
    .catch((error) => {
      console.error(`showListToDenyTournament error: ${error.message}`);
      return bot.reply(update, 'Me rompí');
    });
}

function denyTournament(bot, update) {
  update.session.status = 'none';
  Tournament.findOne({
    name: {
      $regex: update.message.text,
      $options: 'i'
    }
  })
    .then((tournament) => {
      if (!tournament) {
        return bot.reply(update, 'No encontré el torneo.');
      }
      if (update.user.deniedTournaments.indexOf(tournament._id.toString()) >= 0) {
        return bot.reply(update, 'Ya estaba en la lista.');
      }
      update.user.deniedTournaments.push(tournament._id);
      return update.user.save()
        .then(() => {
          return bot.reply(update, 'Listo!');
        })
    })
    .catch((error) => {
      console.error(`denyTournament error: ${error.message}`);
      return bot.reply(update, 'Me rompí');
    });
}

function showListToAllowTournament(bot, update) {
  update.session.status = 'allow_tournament';
  Tournament.find()
    .then((tournaments) => {
      let denied = tournaments.filter((elem) => {
        return update.user.deniedTournaments.indexOf(elem._id.toString()) >= 0;
      });
      if (denied.length === 0) {
        return bot.reply('No hay torneos en la lista.');
      }
      let btnOptions = []
      denied.forEach((elem) => {
        btnOptions.push(elem.name);
      });
      if (denied.length > 3) {
        for (let i = 0; i < (update.session.page - 1) * 2; i++) {
          btnOptions.shift();
        }
        let areMore = false;
        while (btnOptions.length > 2) {
          areMore = true;
          btnOptions.pop();
        }
        if (update.session.page > 1) {
          btnOptions.push('Ver menos...');
        }
        if (areMore) {
          btnOptions.push('Ver mas...');
        }
      }
      return bot.sendDefaultButtonMessageTo(btnOptions, 'Seleccione un torneo para agregar a la lista:', update.sender.id)
    })
    .catch((error) => {
      console.error(`showListToAllowTournament error: ${error.message}`);
      return bot.reply(update, 'Me rompí');
    });
}

function allowTournament(bot, update) {
  update.session.status = 'none';
  Tournament.findOne({
    name: {
      $regex: update.message.text,
      $options: 'i'
    }
  })
    .then((tournament) => {
      if (!tournament) {
        return bot.reply(update, 'No encontré el torneo.');
      }
      if (update.user.deniedTournaments.indexOf(tournament._id.toString()) < 0) {
        return bot.reply(update, 'No estaba en la lista.');
      }
      update.user.deniedTournaments = update.user.deniedTournaments.filter(elem => {
          return tournament._id.toString() !== elem.toString();
      });
      return update.user.save()
        .then(() => {
          return bot.reply(update, 'Listo!');
        })
    })
    .catch((error) => {
      console.error(`allowTournament error: ${error.message}`);
      return bot.reply(update, 'Me rompí');
    });
}

function controller(bot, update, next) {
  if (update.message.text === '/config_tournaments') {
    return showDeniedTournaments(bot, update);
  }
  if (update.message.text === '/deny_tournament') {
    update.session.page = 1;
    return showListToDenyTournament(bot, update);
  }
  if (update.message.text === '/allow_tournament') {
    update.session.page = 1;
    return showListToAllowTournament(bot, update);
  }
  if (update.session.status === 'deny_tournament') {
    if (update.message.text === 'Ver mas...') {
      update.session.page++;
      return showListToDenyTournament(bot, update);
    }
    if (update.message.text === 'Ver menos...') {
      update.session.page--;
      return showListToDenyTournament(bot, update);
    }
    return denyTournament(bot, update);
  }
  if (update.session.status === 'allow_tournament') {
    if (update.message.text === 'Ver mas...') {
      update.session.page++;
      return showListToAllowTournament(bot, update);
    }
    if (update.message.text === 'Ver menos...') {
      update.session.page--;
      return showListToAllowTournament(bot, update);
    }
    return allowTournament(bot, update);
  }
  return next();
}

module.exports = controller;
