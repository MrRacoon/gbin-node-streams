const restify = require('restify');
const fs = require('fs');
const path = require('path');
const Rx = require('rxjs')

const filename = 'data.json'
const file = path.resolve(__dirname, filename);

const server = restify.createServer();
let count = 0;

server.get('/data', (req, res) => {
  console.log('requesting data', ++count);
  fs.createReadStream(file).pipe(res);
});

server.get('/fibs/:amount', (req, res) => {
  // http://stackoverflow.com/a/25206753
  const fibs = fibonacci();
  let n = (+req.params.amount) || 1;
  n = n > 10 ? 10 : n < 0 ? 1 : n;
  Rx.Observable
    .interval(1000)
    .take(n)
    .subscribe(x => {
      const data = fibs.next().value;
      console.log('calculated data:', data);
      res.write(`${data}\r\n`);
    }, err => {
      console.log('errored', err);
      res.status(202)
      res.end()
    }, () => {
      console.log('ended');
      res.status(200)
      res.end()
    });
});

server.get('/', (req, res) => {
  res.send('ok');
});

server.listen(3000, () => {
  console.log('listening');
});

function* fibonacci(){
  let fn1 = 1;
  let fn2 = 1;
  while (1) {
      let current = fn2;
      fn2 = fn1;
      fn1 = fn1 + current;
      yield current;
    }
}
