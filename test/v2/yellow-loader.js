const {Loader} = require('../../src/v2/yellow-loader')
const rx = require('rxjs')
const {toArray} = require('rxjs/operators')
const expect = require('chai').use(require('chai-sinon')).expect
const sinon = require('sinon')
describe('yellow-loader',function(){
  describe('loader',function(){
    it('Should pass options to rules',function(){
      const rule = {}
      const loader = new Loader({option:'value'})
      loader.add(rule)
      expect(rule).to.have.property('option','value')
    })

    it('Should call scan on all rules',function(){
      const rule1 = { scan:sinon.spy()}
      const rule2 = { scan:sinon.spy()}
      const loader = new Loader()
      loader.add(rule1)
      loader.add(rule2)
      loader.scan()
      expect(rule1.scan).to.have.been.called
      expect(rule2.scan).to.have.been.called
    })
    it('Should collect result of all scans',function(){
      const rule1 = { scan:()=>rx.of('a','b')}
      const rule2 = { scan:()=>rx.of('c','d')}
      const loader = new Loader()
      loader.add(rule1)
      loader.add(rule2)
      loader.scan().pipe(toArray()).subscribe((entries) => {
        expect(entries).property('length',4)
        expect(entries).to.containSubset(['a'])
        expect(entries).to.containSubset(['b'])
        expect(entries).to.containSubset(['c'])
        expect(entries).to.containSubset(['d'])
      })
    })    
  })
  
})
