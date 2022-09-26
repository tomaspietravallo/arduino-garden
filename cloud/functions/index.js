import * as Functions from '@google-cloud/functions-framework';
import * as BigQuery from '@google-cloud/bigquery';
var PROJECT_ID = process.env.PROJECT_ID;
var DATASET = process.env.DATASET;
var TABLE = process.env.TABLE;
var isJest = process.env.NODE_ENV === 'test';
var bigQuery = new BigQuery.BigQuery({ projectId: PROJECT_ID, keyFilename: (isJest ? "../../key.json" : undefined) });
;
export function logData(req) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rows = req.body.arduino_data
                        .map(function (data) { return ({ date: new Date(data.u), soil_humidity: data.h, temperature: data.t }); });
                    return [4, bigQuery.dataset(DATASET)
                            .table(TABLE)
                            .insert(rows, {
                            skipInvalidRows: false,
                            ignoreUnknownValues: false,
                            createInsertId: false
                        })];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
export function pushNotificationToUser() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2];
        });
    });
}
export var entry = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resolveRequest;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(JSON.stringify(req.body));
                req.body = JSON.parse(req.body);
                console.log(JSON.stringify(req.body));
                console.log(JSON.stringify(req.body.arduino_data));
                console.log(typeof (req.body.arduino_data));
                return [4, logData(req)];
            case 1:
                resolveRequest = _a.sent();
                console.log(resolveRequest);
                res.status(200);
                return [2];
        }
    });
}); };
Functions.http('entry', entry);
