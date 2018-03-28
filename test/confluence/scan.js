const expect = require('chai').use(require('chai-subset')).expect
const nock = require('nock')
const scan = require('../../src/confluence/scan')
describe('scan', () => {
  before(() => {
  nock('http://example.org').get(/\/rest\/api\/content\/search\?.*/).reply(200,{
      "results": [
        {
          "id": "!!id!!",
          "type": "page",
          "status": "current",
          "title": "!!title!!",
          "metadata": {
            "labels": {
              "results": [
                {
                  "name": "!!!label1!!!"
                },
                {
                  "name": "!!!label2!!!"
                }
              ]
            }
          },
          "container": {
            "id": 589827,
            "key": "!!spaceKey!!",
            "name": "!!spaceName!!",
          },
          "body": {
            "export_view": {
              "value": "!!content!!",
            },
          },
        }
      ],
      "start": 0,
      "limit": 1,
      "size": 1
    })
  })

  it('Should extract entities', function (done) {
    scan('http://example.org').toArray().subscribe((entries) => {
      expect(entries).to.containSubset([{
        "id": "!!id!!",
        "type": "page",
        "status": "current",
        "title": "!!title!!",
        "content": "!!content!!",
        "labels": ["!!!label1!!!","!!!label2!!!"],
        "space": {
          "id": 589827,
          "key": "!!spaceKey!!",
          "name": "!!spaceName!!",
        }
      }])
      done()
    }, (error) => done(error))
  })
})
