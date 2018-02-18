const expect = require('chai').use(require('chai-subset')).expect
const label = require('../src/label')
const rxjs = require('rxjs')
describe('label', () => {
  it('Should keep $label', function (done) {
    label.set(rxjs.Observable.of({
      $label: "label"
    })).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $label: "label"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should use label', function (done) {
    label.set(rxjs.Observable.of({
      label: "label"
    })).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $label: "label"
      }])
      done()
    }, (error) => done(error))
  })

  it('Should use name', function (done) {
    label.set(rxjs.Observable.of({
      name: "label"
    })).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $label: "label"
      }])
      done()
    }, (error) => done(error))
  })

  it('Should use $key', function (done) {
    label.set(rxjs.Observable.of({
      key: "Label"
    }),(entry)=>entry.key).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $label: "Label"
      }])
      done()
    }, (error) => done(error))
  })

  it('Should transform $key', function (done) {
    label.set(rxjs.Observable.of({
      key: "label-label"
    }),(entry)=>entry.key).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $label: "Label Label"
      }])
      done()
    }, (error) => done(error))
  })
})
