var GCP_Function = require('../dist/index');
var expressMock = require('./__mocks__/express');
const env = require('dotenv').config({path: './.env'});

const createTestRequest = (messageBody) => ({ body: messageBody });

const testMessage = createTestRequest(
    {
        "arduino_data": [
            { "u": 1664140542, "t": 10, "h": 0}
        ]
    }
)

beforeEach(() => {
    Object.assign(process.env, {
        PROJECT_ID: env.parsed.PROJECT_ID,
        DATASET: env.parsed.DATASET,
        TABLE: env.parsed.TABLE
    })
    jest.resetModules();
    GCP_Function = require('../dist/index');
})

describe("test entry function", () => {
    // Calls actual GCP APIs
    test.skip("test with GCP", async () => {
        const Response = new expressMock.Response();
        const api_response = GCP_Function.entry(testMessage, Response);
        await expect(api_response).resolves.not.toThrow();
        expect(Response.status).toBeCalledTimes(1);
        expect(Response.end).toHaveBeenCalledTimes(1);
    })
    test("test with mocks", async () => {
        jest.createMockFromModule('@google-cloud/functions-framework');
        jest.createMockFromModule('@google-cloud/bigquery');
        GCP_Function = require('../dist/index');
        const Response = new expressMock.Response();
        const api_response = GCP_Function.entry(testMessage, Response);
        await expect(api_response).resolves.not.toThrow();
        expect(Response.status).toBeCalledTimes(1)
        expect(Response.end).toHaveBeenCalledTimes(1);
    })
})