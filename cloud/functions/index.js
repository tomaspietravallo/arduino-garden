var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Functions from '@google-cloud/functions-framework';
import * as BigQuery from '@google-cloud/bigquery';
const PROJECT_ID = process.env.PROJECT_ID;
const DATASET = process.env.DATASET;
const TABLE = process.env.TABLE;
const isJest = process.env.NODE_ENV === 'test';
const bigQuery = new BigQuery.BigQuery({ projectId: PROJECT_ID, keyFilename: (isJest ? `../../key.json` : undefined) });
;
export function logData(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const rows = req.body.arduino_data
            .map((data) => ({ date: new Date(data.u), soil_humidity: data.h, temperature: data.t }));
        return yield bigQuery.dataset(DATASET)
            .table(TABLE)
            .insert(rows, {
            skipInvalidRows: false,
            ignoreUnknownValues: false,
            createInsertId: false
        });
    });
}
export function pushNotificationToUser() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
export const entry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resolveRequest = yield logData(req);
    console.log(resolveRequest);
    res.status(200);
});
Functions.http('entry', entry);