// loggingMiddleware.js
function loggingMiddleware(req, res, next) {
  const { method, url, headers, body } = req;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url}`);
  console.log('Headers:', headers);
  console.log('Body:', body);

  next();
}

// errorHandlingMiddleware.js
function errorHandlingMiddleware(err, req, res, next) {
  console.error('An error occurred:', err);
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = {loggingMiddleware, errorHandlingMiddleware};