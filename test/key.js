const expect = require('chai').use(require('chai-subset')).expect
const key = require('../src/key')
const rxjs = require('rxjs')
const {toArray} = require('rxjs/operators')
describe('key', () => {
  it('Should keep $key', function (done) {
    key.set(rxjs.of({
      $key: "key"
    })).pipe(toArray()).subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "key"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should use key', function (done) {
    key.set(rxjs.of({
      key: "key"
    })).pipe(toArray()).subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "key"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should use id', function (done) {
    key.set(rxjs.of({
      id: "key"
    })).pipe(toArray()).subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "key"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should use label', function (done) {
    key.set(rxjs.of({
      label: "key"
    }),(entry)=>entry.label).pipe(toArray()).subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "key"
      }])
      done()
    }, (error) => done(error))
  })

  it('Should transform label', function (done) {
    key.set(rxjs.of({
      label: "Key Key"
    }),(entry)=>entry.label).pipe(toArray()).subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "key-key"
      }])
      done()
    }, (error) => done(error))
  })
})
