const Functions = require('@google-cloud/functions-framework');
const BigQuery = require('@google-cloud/bigquery');

const entry = async (req, res) => {
    console.log(JSON.stringify(req.body));
    const parsed = JSON.parse(req.body);
    console.log(JSON.stringify(parsed));
    console.log(JSON.stringify(parsed.arduino_data));
    console.log(typeof parsed.arduino_data);
    res.status(200);
};

Functions.http('entry', entry);
