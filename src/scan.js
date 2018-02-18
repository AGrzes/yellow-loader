const rx = require('rxjs')
const walker = require('walker')
const path = require('path')
module.exports = (basePath) => {
  const walk = walker(basePath)
  const connect = rx.Observable.fromEvent(walk, 'connect');
  const error = rx.Observable.fromEvent(walk, 'error').flatMap(rx.Observable.throwError);
  const end = rx.Observable.fromEvent(walk, 'end');
  const data = rx.Observable.fromEvent(walk, 'file', (filePath) => ({
    $metadata: {
      path: filePath,
      fileName: path.basename(filePath)
    }
  }));
  return data.takeUntil(end.race(error))
}
