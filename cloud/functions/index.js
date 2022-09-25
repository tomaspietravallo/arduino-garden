const functions = require('@google-cloud/functions-framework');

// Register an HTTP function with the Functions Framework
functions.http('entry', (req, res) => {
  // Your code here
  const body = `${JSON.stringify(req.body)}`;
  console.log(body);
  // Send an HTTP response
  res.status(200).json(body);
});