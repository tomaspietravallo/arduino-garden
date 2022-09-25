var GCP_Function = require('../index');
var express = require('express')();

const message = {
    "body": {
        "arduino_data": [
            { "u": 1664140542, "t": 10, "h": 0}
        ]
    }
}

beforeEach(() => {
    Object.assign(process.env, {
        PROJECT_ID: process.env-PROJECT_ID,
        DATASET: process.env.DATASET,
        TABLE: process.env.TABLE
    })
    jest.resetModules();
    GCP_Function = require('../index');
})

describe("test message", ()=>{
    test("test", async () => {
        const response = await GCP_Function.entry(message, { status: () => {} });
    })
})