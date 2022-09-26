var GCP_Function = require('../index');
const env = require('dotenv').config({path: './.env'});

const testMessage = {
    "body": {
        "arduino_data": [
            { "u": 1664140542, "t": 10, "h": 0}
        ]
    }
}

beforeEach(() => {
    Object.assign(process.env, {
        PROJECT_ID: env.parsed.PROJECT_ID,
        DATASET: env.parsed.DATASET,
        TABLE: env.parsed.TABLE
    })
    jest.resetModules();
    GCP_Function = require('../index');
})

describe("test entry function", () => {
    // Calls actual GCP APIs
    test.skip("test with GCP", async () => {
        testMessage.body = JSON.stringify(testMessage.body);
        const Response = { status: jest.fn((val) => { return val }) };
        const api_response = GCP_Function.entry(testMessage, Response);
        await expect(api_response).resolves.not.toThrow();
        expect(Response.status).toBeCalledTimes(1)
    })
    test("test with mocks", async () => {
        testMessage.body = JSON.stringify(testMessage.body);
        jest.createMockFromModule('@google-cloud/functions-framework');
        jest.createMockFromModule('@google-cloud/bigquery');
        GCP_Function = require('../index');
        const Response = { status: jest.fn((val) => { return val }) };
        const api_response = GCP_Function.entry(testMessage, Response);
        await expect(api_response).resolves.not.toThrow();
        expect(Response.status).toBeCalledTimes(1)
    })
})