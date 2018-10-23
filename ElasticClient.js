
class ElasticClient {
    constructor() {
        this.url = 'http://localhost:9200/'
    }
    makeCall(api, cb, body) {
        var obj = {method:'PUT'}
        if (body) {
            obj.headers = {'Content-type':'application/json'}
            obj.body =  JSON.stringify(body)
        }
        console.log(obj)
        fetch(`${this.url}${api}`, obj).then(res => res.json()).then((data) => {
            console.log(data)
            cb()
        })
    }
    createIndex(indexName) {
        const localIndex = window.localStorage.getItem(indexName)
        if (localIndex == null) {
            this.makeCall(`${indexName}?pretty`, () => {
                localStorage.setItem(indexName, 0)
                this.makeCall(`${indexName}?pretty`)
            })
        }
    }

    createDocument(indexName, body) {
        const indexID = parseInt(window.localStorage.getItem(indexName))
        if (indexID != null) {
            this.makeCall(`${indexName}/_doc/${indexID + 1}?pretty`, () => {
                localStorage.setItem(indexName, indexID + 1)
            }, body)
        }
    }

    removeReadOnly(indexName, cb) {
        this.makeCall(`${indexName}/_settings`, () => {cb()}, {"index.blocks.read_only_allow_delete": null})
    }

    createDocumentForIndex(indexName, body) {
        this.removeReadOnly(indexName, () => {
            this.createDocument(indexName, body)
        })
    }
}

const elasticClient = new ElasticClient()
