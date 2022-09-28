class BigQueryMock {
    constructor(params) {
        this.params = params
    }

    dataset(){
        return this
    }

    table(){
        return this
    }

    insert(){
        return this
    }
}

exports.BigQuery = BigQueryMock;