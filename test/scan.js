const expect = require('chai').use(require('chai-subset')).expect
const mock = require('mock-fs')
const scan = require('../src/scan')
const {toArray} = require('rxjs/operators')
describe('scan', () => {
  before(() => {
    mock({
      '/base/file1': '',
      '/base/file2': '',
      '/another': ''
    })
  })
  after(() => mock.restore())

  it('Should scan selected directory', function (done) {
    scan('/base').pipe(toArray()).subscribe((entries) => {
      expect(entries).to.containSubset([{
        path: '/base/file1',
        fileName: 'file1'
      }])
      expect(entries).to.containSubset([{
        path: '/base/file2',
        fileName: 'file2'
      }])
      expect(entries).not.to.containSubset([{
        path: '/another',
        fileName: 'another'
      }])
      done()
    }, (error) => done(error))
  })
})
