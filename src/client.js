const fetch = require('rxjs-fetch');

const log = console.log.bind(console);
module.exports = e = {};

e.ping = () =>
  fetch('http://localhost:3000/')
    .text();

e.getData = () =>
  fetch('http://localhost:3000/data')
    .json();

e.fibs = () =>
  fetch('http://localhost:3000/fibs')
    .text()
    .subscribe(log)
