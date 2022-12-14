var GCP_Function = require('../dist/index');
var expressMock = require('./__mocks__/express');
const env = require('dotenv').config({path: './.env'});

const createTestRequest = (messageBody) => ({ body: messageBody });

const testMessage = Object.freeze(createTestRequest(
    {
        "arduino_data": [
            { "u": new Date().getTime()/1000, "t": 10, "h": 0}
        ]
    }
));

beforeEach(() => {
    Object.assign(process.env, {
        PROJECT_ID: env.parsed.PROJECT_ID,
        DATASET: env.parsed.DATASET,
        TABLE: env.parsed.TABLE
    })
    jest.resetModules();
    jest.createMockFromModule('@google-cloud/functions-framework');
    jest.createMockFromModule('@google-cloud/bigquery');
    GCP_Function = require('../dist/index');
})

describe("entry", () => {
    // Calls actual GCP APIs (BigQuery)
    test.skip("test with GCP", async () => {
        jest.resetModules();
        jest.dontMock('@google-cloud/bigquery');
        jest.dontMock('@google-cloud/functions-framework');
        GCP_Function = require('../dist/index');
        const Response = new expressMock.Response();
        const api_response = GCP_Function.entry(testMessage, Response);
        await expect(api_response).resolves.not.toThrow();
        expect(Response.status).toBeCalledTimes(1);
        expect(Response.end).toHaveBeenCalledTimes(1);
        jest.doMock('@google-cloud/bigquery');
        jest.doMock('@google-cloud/functions-framework');
    })
    test("test with mocks", async () => {
        const Response = new expressMock.Response();
        const api_response = GCP_Function.entry(testMessage, Response);
        await expect(api_response).resolves.not.toThrow();
        expect(Response.status).toBeCalledTimes(1)
        expect(Response.end).toHaveBeenCalledTimes(1);
    })
    test("non-array messages", async () => {
        const Response = new expressMock.Response();
        const api_response = GCP_Function.entry(createTestRequest({ arduino_data: { u: 1664140542, t: 10, h: 0 } }), Response);
        await expect(api_response).resolves.not.toThrow();
        expect(Response.status).toBeCalledTimes(1)
        expect(Response.end).toHaveBeenCalledTimes(1);
    })
})

describe("logData", () => {
    test("log valid data", async () => {
        await expect( GCP_Function.logData(testMessage) ).resolves.not.toThrow();
    });

    test("log invalid data (invalid date)", async () => {
        await expect(GCP_Function.logData( createTestRequest({ arduino_data: { "u": 1000, "t": 10, "h": 0} }) )).rejects.toThrow();
    })

    test("log invalid data (invalid body)", async () => {
        await expect(GCP_Function.logData( createTestRequest({ arduino_data: undefined }) )).rejects.toThrow();
        await expect(GCP_Function.logData( createTestRequest({}) )).rejects.toThrow();
        await expect(GCP_Function.logData( undefined )).rejects.toThrow();
    })
})

describe("pushNotificationToUser", () => {
    test("test empty", () => {
        expect(GCP_Function.pushNotificationToUser).not.toThrow()
    })
})

describe("GCP Environment", () => {
    test("isJest=false, do not use test key.json tokens", () => {
        Object.assign(process.env, {
            NODE_ENV: "not-jest",
        })
        jest.resetModules();
        GCP_Function = require('../dist/index');
        // reset to default
        Object.assign(process.env, {
            NODE_ENV: "test",
        })
    })
})