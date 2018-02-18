const expect = require('chai').use(require('chai-subset')).expect
const mock = require('mock-fs')
const json = require('../src/json')
const rxjs = require('rxjs')
describe('json', () => {
  before(() => {
    mock({
      '/file1.json': '{"key":"value"}',
      '/file2.json': '[{"key1":"value1"},{"key2":"value2"}]',
    })
  })
  after(() => mock.restore())

  it('Should load json', function (done) {
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

  it('Should load multiple documents', function (done) {
    json.load(rxjs.Observable.of({
      path: '/file2.json',
      fileName: 'file2.json'
    })).toArray().subscribe((entries) => {
      expect(entries).to.containSubset([{
        $metadata: {
          path: '/file2.json',
          fileName: 'file2.json'
        },
        "key1": "value1"
      }])
      expect(entries).to.containSubset([{
        $metadata: {
          path: '/file2.json',
          fileName: 'file2.json'
        },
        "key2": "value2"
      }])
      done()
    }, (error) => done(error))
  })
})
