System.register("src/index", ["@google-cloud/functions-framework", "@google-cloud/bigquery"], function (exports_1, context_1) {
    "use strict";
    var Functions, BigQuery, PROJECT_ID, DATASET, TABLE, isJest, bigQuery, entry;
    var __moduleName = context_1 && context_1.id;
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
    exports_1("logData", logData);
    async function pushNotificationToUser() {
    }
    exports_1("pushNotificationToUser", pushNotificationToUser);
    return {
        setters: [
            function (Functions_1) {
                Functions = Functions_1;
            },
            function (BigQuery_1) {
                BigQuery = BigQuery_1;
            }
        ],
        execute: function () {
            PROJECT_ID = process.env.PROJECT_ID;
            DATASET = process.env.DATASET;
            TABLE = process.env.TABLE;
            isJest = process.env.NODE_ENV === 'test';
            bigQuery = new BigQuery.BigQuery({ projectId: PROJECT_ID, keyFilename: (isJest ? `../../key.json` : undefined) });
            ;
            exports_1("entry", entry = async (req, res) => {
                const resolveRequest = await logData(req);
                console.log(resolveRequest);
                res.status(200);
            });
            Functions.http('entry', entry);
        }
    };
});
