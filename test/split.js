const expect = require('chai').use(require('chai-subset')).expect
const split = require('../src/split')
const rx = require('rxjs')
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
 
})
