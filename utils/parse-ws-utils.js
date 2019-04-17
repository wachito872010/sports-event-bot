'use strinct';
const {Event, Tournament} = require('../models');
const moment = require('moment');

function saveTournament(data) {
  return Tournament.findOneAndUpdate({
    code: data.id
  }, {
    code: data.id,
    name: data.nombre
  }, {
    upsert: true
  });
}

function saveEvent(data) {
  return Tournament.findOne({
    code: data.torneoId
  })
      .then(tournament => {
        if (!tournament) {
          throw new Error('tournament_not_found');
        }
        return Event.findOneAndUpdate({
          code: data.id
        }, {
          code: data.id,
          name: data.nombre,
          date: moment(data.fecha, 'YYYY-MM-DD HH:mm:ss').add(3, 'hours'),
          tvInfo: data.canales.map(elem => {
            return elem.nombre;
          }).join(' -- '),
          tournament: tournament._id
        }, {
          upsert: true
        });
      })
      .catch(error => {
        console.error(`saveEvent error - ${error.message} - id event: ${data.id}`);
      });
}

module.exports = {
  saveTournament,
  saveEvent
};
