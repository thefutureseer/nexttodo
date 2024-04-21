const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./graphql/index.js');
const {contextCreation} = require('./globalContext/context.js');
const {authenticate} = require('./auth/authMiddleware.js');

// const {errorHandlingMiddleware } = require('./middleware/logging.js');
const connectToMongoDB = require('./dbconfig/mongoConfig.js');

require('dotenv').config();

const PORT = process.env.PORT || 4000;


const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Pass user information to context
  context: ({ req }) => contextCreation({ req }),
  introspection: true,
  formatError: (error) => {
    const { message, path } = error;
    return { message, path };
  },
});

async function startApolloServer() {
  try {
    await server.start();
    
    const app = express();

    // Middleware
    app.use(authenticate);
      
    await connectToMongoDB(); // Connect to MongoDB

      // Apply Apollo Server middleware to Express app
    server.applyMiddleware({ 
      app,
      path: '/graphql',
    });

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting Apollo Server:', error);
    process.exit(1); // Exit the process if an error occurs during startup
  }
};

startApolloServer().catch((error) => {
    console.error('Error starting Apollo Server:', error);
});