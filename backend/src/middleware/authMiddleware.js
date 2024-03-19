const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const { JWT_SECRET } = require('../util/config'); // Import the JWT_SECRET from the config file

function authenticate(req, res, next) { // Define the authenticate middleware function
  const authHeader = req.headers.authorization; // Extract the Authorization header from the request

  // Create req.context if it doesn't exist
  req.context = {};

  // Check if the request is for the GraphQL playground
  if (req.path === '/graphql' && req.method === 'GET') { // If the request path is /graphql and the method is GET
    // Allow access to the playground without authentication
    console.log('Skipping token verification for GraphQL playground request');
    return next(); // Skip token verification and move to the next middleware or route handler
  }

    // Skip authentication for specific routes like user signup
    if (req.path === '/graphql' && req.method === 'POST') {
      // Allow access without authentication
      return next();
    }  

  // Check if the Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) { // If no Authorization header or it doesn't start with 'Bearer '
    return res.status(401).json({ message: 'Unauthorized: No token provided' }); // Respond with 401 Unauthorized
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the Authorization header

  // Verify the token using the JWT_SECRET
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  
    // Attach decoded user information to the context object
    req.context.user = decoded.user;
  
    next();
  });
}

module.exports = {
  authenticate, // Export the authenticate middleware function
};