const {Loader} = require('../../src/v2/yellow-loader')
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
      const rule = { scan:sinon.spy()}
      const loader = new Loader()
      loader.add(rule)
      loader.scan()
      expect(rule.scan).to.have.been.called
    })
  })
  
})
