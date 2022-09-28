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
    if (req === undefined || req.body === undefined || req.body.arduino_data === undefined) {
        throw new Error(`req.body.arduino_data is undefined. ${JSON.stringify(req)}::${JSON.stringify(req.body)}::${req.body.arduino_data}`);
    }
    const rows = (Array.isArray(req.body.arduino_data) ? req.body.arduino_data : [req.body.arduino_data])
        .map((data) => ({ date: new Date(data.u * 1000), soil_humidity: data.h, temperature: data.t }));
    if (!rows.every((e) => e.date.getFullYear() > 2020 && e.date.getFullYear() < 2100)) {
        throw new Error(`Dates do not seem to be correct: ${JSON.stringify(rows)}`);
    }
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
    const resolveRequest = await logData(req);
    res.status(200);
    res.end();
};
exports.entry = entry;
Functions.http('entry', exports.entry);
