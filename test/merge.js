const expect = require('chai').use(require('chai-subset')).expect
const merge = require('../src/merge')
const rxjs = require('rxjs')
describe('label', () => {
  it('Should build array of entries', function (done) {
    merge(rxjs.Observable.of({
      $key: "value1"
    },{
      $key: "value2"
    })).last().subscribe((entries) => {
      expect(entries).to.have.property('length', 2)
      expect(entries).to.containSubset([{
        $key: "value1"
      }])
      expect(entries).to.containSubset([{
        $key: "value2"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should combine values', function (done) {
    merge(rxjs.Observable.of({
      $key: "value1",
      attribute:"value1"
    },{
      $key: "value1",
      attribute:"value2"
    })).last().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "value1",
        attribute:["value1"]
      }])
      expect(entries).to.containSubset([{
        $key: "value1",
        attribute:["value2"]
      }])
      done()
    }, (error) => done(error))
  })
  it('Should use present values', function (done) {
    merge(rxjs.Observable.of({
      $key: "value1",
      attribute1:"value1"
    },{
      $key: "value1",
      attribute2:"value2"
    })).last().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "value1",
        attribute1:"value1"
      }])
      expect(entries).to.containSubset([{
        $key: "value1",
        attribute2:"value2"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should skip generated if one is real entity', function (done) {
    merge(rxjs.Observable.of({
      $key: "value1",
      attribute:"value1"
    },{
      $metadata:{
        generated:true
      },
      $key: "value1",
      attribute:"value2"
    },{
      $metadata:{
        generated:true
      },
      $key: "value2",
      attribute:"value1"
    },{
      $key: "value2",
      attribute:"value2"
    })).last().subscribe((entries) => {
      expect(entries).to.have.property('length', 2)
      expect(entries).to.containSubset([{
        $key: "value1",
        attribute:"value1"
      }])
      expect(entries).to.containSubset([{
        $key: "value2",
        attribute:"value2"
      }])
      done()
    }, (error) => done(error))
  })
  it('Should combine multiple values', function (done) {
    merge(rxjs.Observable.of({
      $key: "value1",
      attribute:"value1"
    },{
      $key: "value1",
      attribute:"value2"
    },{
      $key: "value1",
      attribute:"value3"
    })).last().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "value1",
        attribute:["value1"]
      }])
      expect(entries).to.containSubset([{
        $key: "value1",
        attribute:["value2"]
      }])      
      expect(entries).to.containSubset([{
        $key: "value1",
        attribute:["value3"]
      }])
      done()
    }, (error) => done(error))
  })
  it('Should merge arrays', function (done) {
    merge(rxjs.Observable.of({
      $key: "value1",
      attribute:["value1"]
    },{
      $key: "value1",
      attribute:["value2"]
    })).last().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $key: "value1",
        attribute:["value1"]
      }])
      expect(entries).to.containSubset([{
        $key: "value1",
        attribute:["value2"]
      }])
      done()
    }, (error) => done(error))
  })  
})
