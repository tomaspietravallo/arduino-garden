var functions = require('@google-cloud/functions-framework');
functions.http('entry', function (req, res) {
    // Your code here
    var body = "".concat(JSON.stringify(req.body));
    console.log("logs: ".concat(body));
    // Send an HTTP response
    res.status(200).json(body);
});
functions.http('secondaryPublicFacingFunction', function (req, res) {
    res.status(200).send("Secondary function triggered");
});
