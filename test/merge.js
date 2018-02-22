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
})
