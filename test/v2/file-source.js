const fileSource = require('../../src/v2/file-source')
const expect = require('chai').expect
const mock = require('mock-fs')
describe('file-source', function () {
  describe('FileSource', function () {
    before(() => {
      mock({
        '/base/file1.json': '{"json":"value"}',
        '/base/file2.yaml': 'yaml: value',
        '/base/file3.json': '[{"json1":"value1"},{"json2":"value2"}]',
        '/another': ''
      })
    })
    after(() => mock.restore())

    it('Should scan selected directory', function (done) {
      new fileSource.FileSource('/base/**',{project:'project',rule:'rule'}).scan().toArray().subscribe((entries) => {
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/base/file1.json',
          }
        }])
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/base/file2.yaml'
          }
        }])
        expect(entries).not.to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/another'
          }
        }])
        done()
      }, (error) => done(error))
    })

    it('Should list only files', function (done) {
      new fileSource.FileSource('/base/**',{project:'project',rule:'rule'}).scan().toArray().subscribe((entries) => {
        expect(entries).not.to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/base'
          }
        }])
        done()
      }, (error) => done(error))
    })

    it('Should use base', function (done) {
      new fileSource.FileSource('**', {
        base: '/base',
        project: 'project',
        rule:'rule'
      }).scan().toArray().subscribe((entries) => {
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: 'file1.json'
          }
        }])
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: 'file2.yaml'
          }
        }])
        expect(entries).not.to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/another'
          }
        }])
        done()
      }, (error) => done(error))
    })

    it('Should parse json file', function (done) {
      new fileSource.FileSource('/base/**',{project:'project',rule:'rule'}).scan().toArray().subscribe((entries) => {
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/base/file1.json'
          },
          data: {
            json: "value"
          }
        }])
        done()
      }, (error) => done(error))
    })

    it('Should parse yaml file', function (done) {
      new fileSource.FileSource('/base/**',{project:'project',rule:'rule'}).scan().toArray().subscribe((entries) => {
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/base/file2.yaml'
          },
          data: {
            yaml: "value"
          }
        }])
        done()
      }, (error) => done(error))
    })

    it('Should handle arrays', function (done) {
      new fileSource.FileSource('/base/**',{project:'project',rule:'rule'}).scan().toArray().subscribe((entries) => {
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/base/file3.json#0'
          },
          data: {
            json1: "value1"
          }
        }])
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/base/file3.json#1'
          },
          data: {
            json2: "value2"
          }
        }])
        done()
      }, (error) => done(error))
    })

    it('Should use extract function', function (done) {
      new fileSource.FileSource('/base/**', ({vfile,content}) => ({
        basename: vfile.basename,
        dirname: vfile.dirname,
        details: content
      }),{project:'project',rule:'rule'}).scan().toArray().subscribe((entries) => {
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/base/file2.yaml'
          },
          data:{
            basename: 'file2.yaml',
            dirname: '/base',
            details: {
              yaml: "value"
            }
        }
        }])
        done()
      }, (error) => done(error))
    })
    it('Should handle arrays from extract funtion', function (done) {
      new fileSource.FileSource('/base/**', ({vfile,content}) => ([content,content]),{project:'project',rule:'rule'})
      .scan().toArray().subscribe((entries) => {
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/base/file2.yaml#0'
          },
          data:{
            yaml: "value"
        }
        }])
        expect(entries).to.containSubset([{
          type:'data',
          source: {
            plugin: 'FileSource',
            project: 'project',
            rule:'rule',
            location: '/base/file2.yaml#1'
          },
          data:{
            yaml: "value"
        }
        }])
        done()
      }, (error) => done(error))
    })
  })
})
