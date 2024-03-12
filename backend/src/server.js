// Import required libraries
const express = require('express'); // Import Express framework
const { ApolloServer, gql } = require('apollo-server-express'); // Import Apollo Server and GraphQL library
const mongoose = require('mongoose'); // Import Mongoose library for MongoDB connection

// Import environment variables
require('dotenv').config();

// Import GraphQL schema and resolvers
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

// Create an Apollo Server instance
const server = new ApolloServer({
  typeDefs, // Provide the GraphQL schema
  resolvers, // Provide the resolver functions
  context: ({ req }) => {
    // Retrieve user information from request (if available)
    const user = req.user || null;
    return { user };
  },
  formatError: (error) => {
    // Format errors to include only message and path
    const { message, path } = error;
    return { message, path };
  },
});

// Create an Express app
const app = express();

// Apply middleware to Express app
server.applyMiddleware({ app });

// Define MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo'; // MongoDB URI from environment variable or default URI

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB'); // Log success message if connected to MongoDB
    // Start Express server
    app.listen({ port: process.env.PORT || 4000 }, () => {
      console.log(`Server is running at http://localhost:${process.env.PORT || 4000}/graphql`); // Log server URL if server is running
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err); // Log error message if failed to connect to MongoDB
  });
