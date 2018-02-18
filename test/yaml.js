const expect = require('chai').use(require('chai-subset')).expect
const mock = require('mock-fs')
const yaml = require('../src/yaml')
const rxjs = require('rxjs')
describe('json', () => {
  before(() => {
    mock({
      '/file1.yaml': `key: value
`,
      '/file2.yaml': `---
key1: value1
---
key2: value2
`,
    })
  })
  after(() => mock.restore())

  it('Should load yaml', function (done) {
    yaml.load(rxjs.Observable.of({
      path: '/file1.yaml',
      fileName: 'file1.yaml'
    })).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 1)
      expect(entries).to.containSubset([{
        $metadata: {
          path: '/file1.yaml',
          fileName: 'file1.yaml'
        },
        "key": "value"
      }])
      done()
    }, (error) => done(error))
  })

  it('Should load multiple documents', function (done) {
    yaml.load(rxjs.Observable.of({
      path: '/file2.yaml',
      fileName: 'file2.yaml'
    })).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 2)
      expect(entries).to.containSubset([{
        $metadata: {
          path: '/file2.yaml',
          fileName: 'file2.yaml'
        },
        "key1": "value1"
      }])
      expect(entries).to.containSubset([{
        $metadata: {
          path: '/file2.yaml',
          fileName: 'file2.yaml'
        },
        "key2": "value2"
      }])
      done()
    }, (error) => done(error))
  })

  it('Should skip files that are not yaml', function (done) {
    yaml.load(rxjs.Observable.of({
      path: '/file1.not-yaml',
      fileName: 'file1.not-yaml'
    })).toArray().subscribe((entries) => {
      expect(entries).to.have.property('length', 0)
      done()
    }, (error) => done(error))
  })
})
