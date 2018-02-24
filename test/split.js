const expect = require('chai').use(require('chai-subset')).expect
const split = require('../src/split')
const rx = require('rxjs')
const _ = require('lodash')
describe('split', () => {
  it('Should emit related', function (done) {
    split(rx.Observable.of({
      "@related": {"key":"value"}
    }),(entity)=> entity.key).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 2)
      expect(entries).to.containSubset([{
        "@related":"value"
      }])
      expect(entries).to.containSubset([{
        "key":"value"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should emit related array', function (done) {
    split(rx.Observable.of({
      "@related": [{"key":"value1"},{"key":"value2"}]
    }),(entity)=> entity.key).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 3)
      expect(entries).to.containSubset([{
        "@related":["value1","value2"]
      }])
      expect(entries).to.containSubset([{
        "key":"value1"
      }])
      expect(entries).to.containSubset([{
        "key":"value2"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should copy $metadata', function (done) {
    split(rx.Observable.of({
      $metadata:{
        key:"value"
      },
      "@related": {"key":"value"}
    }),(entity)=> entity.key).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 2)
      expect(entries).to.containSubset([{
        $metadata:{
          key:"value"
        },
        "@related":"value"
      }])
      expect(entries).to.containSubset([{
        $metadata:{
          key:"value"
        },
        "key":"value"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should generate related', function (done) {
    split(rx.Observable.of({
      "@related": "Value"
    }),(entity)=> _.kebabCase(entity.$label)).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 2)
      expect(entries).to.containSubset([{
        "@related":"value"
      }])
      expect(entries).to.containSubset([{
        $metadata:{
          generated: true
        },
        "$label":"Value"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should merge metadata for generated', function (done) {
    split(rx.Observable.of({
      $metadata:{
        key:"value"
      },
      "@related": "Value"
    }),(entity)=> _.kebabCase(entity.$label)).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 2)
      expect(entries).to.containSubset([{
        $metadata:{
          key:"value"
        },
        "@related":"value"
      }])
      expect(entries).to.containSubset([{
        $metadata:{
          generated: true,
          key:"value"
        },
        "$label":"Value"
      }])
      done()
    }, (error) => done(error))
  })
})
