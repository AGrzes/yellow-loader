const expect = require('chai').use(require('chai-subset')).expect
const mock = require('mock-fs')
const main = require('../src/main')
const rxjs = require('rxjs')
const fs = require('fs')
describe('main', () => {
  describe('Basic case', () => {
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
      main('/','/target.json').subscribe(null, (error) => done(error),() => {
        const content = fs.readFileSync('/target.json')
        const modelWrapper = JSON.parse(content)
        expect(modelWrapper).to.have.property('items')
        const model = modelWrapper.items
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
      })
    })
  })
  describe('Relations case', () => {
    before(() => {
      mock({
        '/file1.json': JSON.stringify([{
          $key: "key1",
          "@related": {
            $key: "key2"
          }
        }]),
      })
    })
    after(() => mock.restore())
    it('Should split relations',function(done){
      main('/','/target.json').subscribe(null, (error) => done(error),() => {
        const content = fs.readFileSync('/target.json')
        const modelWrapper = JSON.parse(content)
        expect(modelWrapper).to.have.property('items')
        const model = modelWrapper.items
        expect(model).to.have.property('length', 2)
        expect(model).to.containSubset([{
          $metadata: {
            path: '/file1.json',
            fileName: 'file1.json'
          },
          "$key": "key1",
          "@related": "key2"
        }])
        expect(model).to.containSubset([{
          $metadata: {
            path: '/file1.json',
            fileName: 'file1.json'
          },
          "$key": "key2"
        }])
        done()
      })
    })
  })
  describe('Keys from label', () => {
    before(() => {
      mock({
        '/file1.json': JSON.stringify([{
          $key: "key1",
          "@related": {
            label: "Key2"
          }
        }]),
      })
    })
    after(() => mock.restore())
    it('Should split relations',function(done){
      main('/','/target.json').subscribe(null, (error) => done(error),() => {
        const content = fs.readFileSync('/target.json')
        const modelWrapper = JSON.parse(content)
        expect(modelWrapper).to.have.property('items')
        const model = modelWrapper.items
        expect(model).to.have.property('length', 2)
        expect(model).to.containSubset([{
          $metadata: {
            path: '/file1.json',
            fileName: 'file1.json'
          },
          "$key": "key1",
          "@related": "key-2"
        }])
        expect(model).to.containSubset([{
          $metadata: {
            path: '/file1.json',
            fileName: 'file1.json'
          },
          "$key": "key-2",
          label: "Key2",
          $label: "Key2"
        }])
        done()
      })
    })
  }) 
})
