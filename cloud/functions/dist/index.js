"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entry = exports.pushNotificationToUser = exports.logData = void 0;
const Functions = require("@google-cloud/functions-framework");
const BigQuery = require("@google-cloud/bigquery");
const PROJECT_ID = process.env.PROJECT_ID;
const DATASET = process.env.DATASET;
const TABLE = process.env.TABLE;
const isJest = process.env.NODE_ENV === 'test';
const bigQuery = new BigQuery.BigQuery({
    projectId: PROJECT_ID,
    keyFilename: (isJest ? `../../key.json` : undefined)
});
;
async function logData(req) {
    const rows = req.body.arduino_data
        .map((data) => ({ date: new Date(data.u), soil_humidity: data.h, temperature: data.t }));
    return await bigQuery.dataset(DATASET)
        .table(TABLE)
        .insert(rows, {
        skipInvalidRows: false,
        ignoreUnknownValues: false,
        createInsertId: false
    });
}
exports.logData = logData;
async function pushNotificationToUser() {
}
exports.pushNotificationToUser = pushNotificationToUser;
const entry = async (req, res) => {
    res.status(200);
    res.end();
};
exports.entry = entry;
Functions.http('entry', exports.entry);
