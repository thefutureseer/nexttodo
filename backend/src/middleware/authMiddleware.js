// const { JWT_SECRET } = require('../util/config'); // Import the JWT_SECRET from the config file
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  // Check if the request is for an operation that does not require authentication
  if (req.path === '/graphql' && req.method === 'GET') {
    // Skip authentication for GraphQL playground requests
    console.log('Skipping authentication for GraphQL playground request');
    return next(); // Move to the next middleware or route handler
  }

  // Skip authentication for specific routes like user signup
  if (req.path === '/graphql' && req.method === 'POST') {
    // Allow access without authentication
    return next();
  }  

  // Check if the request is for an operation that requires authentication
  // Implement your authentication logic here

  // Example: Check if authorization header is present
  if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // If authentication is required, continue with authentication logic
  // ...

  let token = req.headers.authorization || '';

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  token = token.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = {
  authenticate,
};
