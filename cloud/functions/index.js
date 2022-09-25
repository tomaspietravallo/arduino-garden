/**
 * Responds to any HTTP request.
 *
 * @param {Request} req HTTP request context.
 * @param {Response} res HTTP response context.
 */

exports.entry = async (req, res) => {
  const request = await req.json();
  let message = request.query.message || request.body.message || 'Hello World!';
  res.status(200).send(message);
};
