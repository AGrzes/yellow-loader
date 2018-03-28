const client = require('confluence-client')
const rx = require('rxjs')
module.exports = (endpoint) => {
  return rx.Observable.fromPromise(client({
    endpoint
  }).search("type = 'page'", "body.export_view,metadata.labels")).flatMap((result)=>{
    return rx.Observable.of(...result.results.map((item)=>({
      "id": item.id,
      "type": item.type,
      "status": item.status,
      "title": item.title,
      "content": item.body.export_view.value,
      "labels": item.metadata.labels.results.map((label)=>label.name),
      "space": {
        "id": item.container.id,
        "key": item.container.key,
        "name": item.container.name
      }
    })))
  })
}
