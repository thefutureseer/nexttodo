const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const { JWT_SECRET } = require('./config'); // Import the JWT_SECRET from the config file

function authenticate(req, res, next) { // Define the authenticate middleware function
  const authHeader = req.headers.authorization; // Extract the Authorization header from the request

  // Check if the request is for the GraphQL playground
  if (req.path === '/graphql' && req.method === 'GET') { // If the request path is /graphql and the method is GET
    // Allow access to the playground without authentication
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
  jwt.verify(token, JWT_SECRET, (err, decoded) => { // Verify the token
    if (err) { // If there's an error verifying the token
      return res.status(401).json({ message: 'Unauthorized: Invalid token' }); // Respond with 401 Unauthorized
    } else { // If the token is valid
      req.user = decoded.user; // Set the decoded user information on the request object
      next(); // Move to the next middleware or route handler
    }
  });
}

module.exports = {
  authenticate, // Export the authenticate middleware function
};
