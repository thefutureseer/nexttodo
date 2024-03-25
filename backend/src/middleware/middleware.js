const setJsonContentType = (req, res, next) => {
  console.log("setting headers: heres token: ",req.headers.authorization)
  res.setHeader('Content-Type', 'application/json');
  
  // Check if authorization token exists in request headers
  const token = req.headers.authorization;
  if (token) {
    console.log("setting token header: ")
    // Add authorization token to outgoing request headers
    // Modify this according to your server's requirements
    res.setHeader('Authorization', token);
  }
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = {
  setJsonContentType,
  errorHandler,
};
