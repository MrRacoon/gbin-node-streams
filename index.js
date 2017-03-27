const Rx = require('rxjs');
const { server, client } = require('./src');

module.exports = e = { server, client };

const BASE = 0;
e.log = console.log.bind(console);

e.sample = [1,2,3,4,5];
e.list   = Rx.Observable.of(1,2,3);

e.nact = e.list
  .map(_ => e.list)
  .map(x => x.map(x => x + 1))
  .switch()
  .scan((acc, x) => acc + x, BASE)
  .windowCount(3)
  .switch();

e.fibs = Rx.Observable.from(fibonacci())
  .take(100);

e.fibsOff = Rx.Observable
  .from(fibonacci())
  .skip(1)
  .take(100)

e.fibsIt = Rx.Observable
  .zip(e.fibs, e.fibsOff, (x, y) => x + y)
  .skipWhile(x => x < 1000000)
  .take(1)
  .subscribe(e.log);

// ================================================================

function* fibonacci(){
  var fn1 = 1;
  var fn2 = 1;
  while (1) {
      var current = fn2;
      fn2 = fn1;
      fn1 = fn1 + current;
      yield current;
    }
}
