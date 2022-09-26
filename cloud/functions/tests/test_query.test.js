var GCP_Function = require('../index');
var express = require('express')();
const env = require('dotenv').config({path: './.env'});

const message = {
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

describe("test message", ()=>{
    test("test", async () => {
        message.body = JSON.stringify(message.body);
        const response = await GCP_Function.entry(message, { status: () => {} });
    })
})