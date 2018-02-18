const expect = require('chai').use(require('chai-subset')).expect
const mock = require('mock-fs')
const main = require('../src/main')
const rxjs = require('rxjs')
describe('main', () => {
  before(() => {
    mock({
      '/file1.json': '{"$key":"value1"}',
      '/file2.json': '[{"key":"value2"},{"id":"value3"}]',
      '/file1.yaml': `$label: value4
`,
            '/file2.yaml': `---
label: value5
---
name: value6
`,
    })
  })
  after(() => mock.restore())
  it('Should load all entities',function(done){
    main('/').subscribe((model) => {
      expect(model).to.have.property('length', 6)
      expect(model).to.containSubset([{
        $metadata: {
          path: '/file1.json',
          fileName: 'file1.json'
        },
        "$key": "value1",
        "$label":"Value 1"
      }])
      expect(model).to.containSubset([{
        $metadata: {
          path: '/file2.json',
          fileName: 'file2.json'
        },
        "$key": "value2",
        "$label":"Value 2"
      }])
      expect(model).to.containSubset([{
        $metadata: {
          path: '/file2.json',
          fileName: 'file2.json'
        },
        "$key": "value3",
        "$label":"Value 3"
      }])
      expect(model).to.containSubset([{
        $metadata: {
          path: '/file1.yaml',
          fileName: 'file1.yaml'
        },
        "$key": "value-4",
        "$label":"value4"
      }])
      expect(model).to.containSubset([{
        $metadata: {
          path: '/file2.yaml',
          fileName: 'file2.yaml'
        },
        "$key": "value-5",
        "$label":"value5"
      }])
      expect(model).to.containSubset([{
        $metadata: {
          path: '/file2.yaml',
          fileName: 'file2.yaml'
        },
        "$key": "value-6",
        "$label":"value6"
      }])
      done()
    }, (error) => done(error))
  })
})
