const functions = require('@google-cloud/functions-framework');

// Register an HTTP function with the Functions Framework
functions.http('entry', (req, res) => {
  // Your code here
  const body = req.body;

  // Send an HTTP response
  res.send(`${JSON.stringify(body)}`);
});