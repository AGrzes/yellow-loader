const rx = require('rxjs')
const walker = require('walker')
const path = require('path')
const {flatMap,race,takeUntil} = require('rxjs/operators')
module.exports = (basePath) => {
  const walk = walker(basePath)
  const connect = rx.fromEvent(walk, 'connect');
  const error = rx.fromEvent(walk, 'error').pipe(flatMap(rx.throwError));
  const end = rx.fromEvent(walk, 'end');
  const data = rx.fromEvent(walk, 'file', (filePath) => ({
    path: filePath,
    fileName: path.basename(filePath)
  }));
  return data.pipe(takeUntil(end.pipe(race(error))))
}
