exports.Response = class Response {
    constructor() {
        this.statusCode = 0;
        this.ended = false;
        this.dataSent = [];

        this.status = jest.fn((val) => {
            if (typeof val !== "number") throw new Error("Jest.mock: Status is not a number");
            this.throwIfEndedResponse();
            this.statusCode = val;
            return this
        });

        this.json = jest.fn((data) => {
            this.throwIfEndedResponse();
            this.dataSent.push(data)
            return this
        });

        this.send = jest.fn((data) => {
            this.throwIfEndedResponse();
            this.dataSent.push(data)
            return this
        });

        this.end = jest.fn(() => {
            this.throwIfEndedResponse();
            this.ended = true;
            return this
        });

        this.throwIfEndedResponse = jest.fn(() => {
            if (this.ended) {
                throw new Error("Jest.mock: Response has ended but more communication was attemped")
            }

        });
    }
}