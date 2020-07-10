// using to generate error
function sendError(res, statusCode, message) {
  return res.status(statusCode).json({ message });
}
module.exports = { sendError };
