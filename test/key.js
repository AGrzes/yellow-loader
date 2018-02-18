const expect = require('chai').use(require('chai-subset')).expect
const key = require('../src/key')
const rxjs = require('rxjs')
describe('json', () => {
  it('Should keep $key', function (done) {
    key.set(rxjs.Observable.of({
      $key: "key"
    })).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "key"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should use key', function (done) {
    key.set(rxjs.Observable.of({
      key: "key"
    })).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "key"
      }])
      done()
    }, (error) => done(error))
  })
})
