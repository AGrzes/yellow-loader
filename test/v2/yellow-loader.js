const {Loader} = require('../../src/v2/yellow-loader')
const expect = require('chai').expect
describe('yellow-loader',function(){
  describe('loader',function(){
    it('Should pass options to rules',function(){
      const rule = {}
      const loader = new Loader({option:'value'})
      loader.add(rule)
      expect(rule).to.have.property('option','value')
    })
  })
  
})
