import functions from '@google-cloud/functions-framework';

functions.http('entry', (req, res) => {
  // Your code here
  const body = `${JSON.stringify(req.body)}`;
  console.log(`logs: ${body}`);
  // Send an HTTP response
  res.status(200).json(body);
});

functions.http('secondaryPublicFacingFunction', (req, res) => {
  res.status(200).send("Secondary function triggered");
});