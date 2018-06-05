const fileSource = require('../../src/v2/file-source')
const expect = require('chai').expect
const mock = require('mock-fs')
describe('file-source',function(){
  describe('FileSource',function(){
    before(() => {
      mock({
        '/base/file1': '',
        '/base/file2': '',
        '/another': ''
      })
    })
    after(() => mock.restore())
  
    it('Should scan selected directory', function (done) {
      new fileSource.FileSource('/base/**').scan().toArray().subscribe((entries) => {
        expect(entries).to.containSubset([{
          path: '/base/file1',
          name: 'file1'
        }])
        expect(entries).to.containSubset([{
          path: '/base/file2',
          name: 'file2'
        }])
        expect(entries).not.to.containSubset([{
          path: '/another',
          name: 'another'
        }])
        done()
      }, (error) => done(error))
    })
  })
})
