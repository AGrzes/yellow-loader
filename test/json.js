const expect = require('chai').use(require('chai-subset')).expect
const mock = require('mock-fs')
const json = require('../src/json')
const rxjs = require('rxjs')
describe('json', () => {
  before(() => {
    mock({
      '/file1.json': '{"key":"value"}',
    })
  })
  after(() => mock.restore())

  it('Should load json scans', function (done) {
    json.load(rxjs.Observable.of({
      path: '/file1.json',
      fileName: 'file1.json'
    })).toArray().subscribe((entries) => {
      expect(entries).to.containSubset([{
        $metadata: {
          path: '/file1.json',
          fileName: 'file1.json'
        },
        "key": "value"
      }])
      done()
    }, (error) => done(error))
  })
})
