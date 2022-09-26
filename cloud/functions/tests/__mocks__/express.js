exports.Response = class Response {
    constructor() {
        this.status = 0;
        this.ended = false;
        this.dataSent = [];
    }

    /** @param { number } val  */
    status(val) {
        if (typeof val !== "number") throw new Error("Jest.mock: Status is not a number");
        this.throwIfEndedResponse();
        this.status = val;
        return this
    };

    json(data) {
        this.dataSent.push(data)
        return this
    }

    end() {
        this.throwIfEndedResponse();
        this.ended = true;
        return this
    };

    throwIfEndedResponse() {
        if (this.ended) {
            throw new Error("Jest.mock: Response has ended but more communication was attemped")
        }
    }
}