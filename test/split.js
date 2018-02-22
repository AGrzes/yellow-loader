const expect = require('chai').use(require('chai-subset')).expect
const split = require('../src/split')
const rx = require('rxjs')
const _ = require('lodash')
describe('split', () => {
  it('Should emit related', function (done) {
    const destination = new  rx.Subject()
    destination.toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        "key":"value"
      }])
      done()
    }, (error) => done(error))
    split(rx.Observable.of({
      "@related": {"key":"value"}
    }),(entity)=> entity.key,(entity)=>destination.next(entity)).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        "@related":"value"
      }])
      destination.complete()
    }, (error) => done(error))
  })
  it('Should copy $metadata', function (done) {
    const destination = new  rx.Subject()
    destination.toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $metadata: "metadata",
        "key":"value"
      }])
      done()
    }, (error) => done(error))
    split(rx.Observable.of({
      $metadata: "metadata",
      "@related": {"key":"value"}
    }),(entity)=> entity.key,(entity)=>destination.next(entity)).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $metadata: "metadata",
        "@related":"value"
      }])
      destination.complete()
    }, (error) => done(error))
  })
  it('Should generate related', function (done) {
    const destination = new  rx.Subject()
    destination.toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $metadata:{
          generated: true
        },
        "$label":"Value"
      }])
      done()
    }, (error) => done(error))
    split(rx.Observable.of({
      "@related": "Value"
    }),(entity)=> _.kebabCase(entity.$label),(entity)=>destination.next(entity)).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        "@related":"value"
      }])
      destination.complete()
    }, (error) => done(error))
  })
})
