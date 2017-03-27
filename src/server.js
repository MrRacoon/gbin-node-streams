const restify = require('restify');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const Rx = require('rxjs')

const filename = 'data.json'
const file = path.resolve(__dirname, filename);

const server = restify.createServer();

server.get('/data', (req, res, next) => {
  fs.createReadStream(file).pipe(res);
})

server.get('/fibs', (req, res, next) => {
  // http://stackoverflow.com/a/25206753
  const fibs = fibonacci();
  let n = req.params.amount || 10;
  n = n > 10 ? 10 : n < 0 ? 1 : n;
  console.log('n', n);
  Rx.Observable
    .interval(1000)
    .take(5)
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
})

server.get('/', (req, res) => {
  res.send('ok');
})

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
