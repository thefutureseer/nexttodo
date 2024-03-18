const express = require('express'); // Import the express framework
const { ApolloServer } = require('apollo-server-express'); // Import Apollo Server for GraphQL
const { Todo } = require('./models'); // Import the Todo model
const {setJsonContentType} = require('./middleware/middleware.js'); // Import middleware to set JSON Content-Type
const { authenticate } = require('./middleware/authMiddleware.js'); // Import authentication middleware
const { typeDefs, resolvers } = require('./graphql/index'); // Import GraphQL type definitions and resolvers
const cors = require('cors'); // Import CORS middleware
const connectToMongoDB = require('./dbconfig/mongoConfig.js'); // Import function to connect to MongoDB

require('dotenv').config(); // Load environment variables from .env file

const PORT = process.env.PORT || 4000; // Set the port from environment variables or default to 4000

const server = new ApolloServer({ // Create a new Apollo Server instance
  typeDefs, // Pass GraphQL type definitions
  resolvers, // Pass GraphQL resolvers
  context: ({ req }) => { // Define context function to pass data to resolvers
    const user = req.user || null; // Get user from request object or set to null if not available
    return { user, Todo }; // Return context object with user and Todo model
  },
  formatError: (error) => { // Define function to format errors
    const { message, path } = error; // Destructure error object to get message and path
    return { message, path }; // Return formatted error object
  },
});

async function startApolloServer() {
  await server.start(); // Start the Apollo Server instance

  const app = express(); // Create an Express application

  app.use(cors({ // Enable CORS middleware
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST'], // Allow GET and POST requests
    credentials: true, // Allow credentials to be sent with requests
  }));

  app.use(setJsonContentType); // Use middleware to set Content-Type header to JSON
  app.use(authenticate); // Use authentication middleware

  server.applyMiddleware({ app }); // Apply Apollo Server middleware to Express app

  await connectToMongoDB(); // Connect to MongoDB

  app.listen(PORT, () => { // Start the Express server
    console.log(`Server is running at http://localhost:${PORT}/graphql`); // Log server start message
  });
}

startApolloServer().catch((error) => { // Start Apollo Server and handle errors
  console.error('Error starting Apollo Server:', error); // Log error if Apollo Server fails to start
});
