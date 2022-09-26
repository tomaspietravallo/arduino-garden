const BigQuery = require('@google-cloud/bigquery');

exports.entry = (req, res) => {
    console.log(JSON.stringify(req.body));
    const parsed = JSON.parse(req.body);
    console.log(JSON.stringify(parsed));
    console.log(JSON.stringify(parsed.arduino_data));
    console.log(parsed.arduino_data);
    res.status(200);
};
