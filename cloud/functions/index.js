"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entry = exports.pushNotificationToUser = exports.logData = void 0;
const Functions = __importStar(require("@google-cloud/functions-framework"));
const BigQuery = __importStar(require("@google-cloud/bigquery"));
const PROJECT_ID = process.env.PROJECT_ID;
const DATASET = process.env.DATASET;
const TABLE = process.env.TABLE;
const isJest = process.env.NODE_ENV === 'test';
const bigQuery = new BigQuery.BigQuery({ projectId: PROJECT_ID, keyFilename: (isJest ? `../../key.json` : undefined) });
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
    console.log(JSON.stringify(req.body));
    req.body = JSON.parse(req.body);
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.body.arduino_data));
    console.log(typeof (req.body.arduino_data));
    const resolveRequest = await logData(req);
    console.log(resolveRequest);
    res.status(200);
};
exports.entry = entry;
Functions.http('entry', exports.entry);
