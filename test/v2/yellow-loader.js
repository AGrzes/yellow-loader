const yellowLoader = require('../../src/v2/yellow-loader')
const expect = require('chai').expect
describe('yellow-loader',function(){
  describe('builder',function(){
    it('Should build loader',function(){
      expect(yellowLoader.builder().build()).to.be.instanceof(yellowLoader.Loader)
    })
  })
})
