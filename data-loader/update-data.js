'use strict';
const request = require('request-promise');
const WS_URL = process.env.WS_URL;
const FUTBOL_NAME = process.env.FUTBOL_NAME;
const parseWsUtils = require('./parse-ws-utils');

function saveTournaments(torneos) {
  return Promise.all(torneos.filter(torneo => {
    return torneo.deporte.nombre === FUTBOL_NAME;
  }).map(torneo => {
    return parseWsUtils.saveTournament(torneo);
  }));
}

function analizeDate(data) {
  let events = [];
  data.torneos.forEach(torneo => {
    if (torneo.deporte.nombre === FUTBOL_NAME) {
      torneo.eventos.forEach(evento => {
        evento.torneoId = torneo.id;
        events.push(evento);
      });
    }
  });
  return Promise.all(events.map(elem => {
    return parseWsUtils.saveEvent(elem);
  }));
}

function update() {
  console.log('------------------------');
  console.log('-- INICIA UPDATE DATA --');
  let response;
  return request({
    url: WS_URL,
    json: true,
  })
    .then(res => {
      response = res;
      return saveTournaments(response.torneos);
    })
    .then(() => {
      return Promise.all(response.fechas.map(elem => {
        return analizeDate(elem);
      }))
    })
    .catch(error => {
      console.error(`ERROR: ${error.message}`);
    })
    .then(() => {
      console.log('-- FIN UPDATE DATA    --');
      console.log('------------------------');
    });
}

module.exports = update;
