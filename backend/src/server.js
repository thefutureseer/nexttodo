const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { Todo, User } = require('./models');
const { setJsonContentType, errorHandler } = require('./middleware/middleware.js');
const { authenticate, context } = require('./middleware/authMiddleware.js');
const { loggingMiddleware, errorHandlingMiddleware } = require('./middleware/logging.js');
const { typeDefs, resolvers } = require('./graphql/index');
const cors = require('cors');
const connectToMongoDB = require('./dbconfig/mongoConfig.js');

require('dotenv').config();

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context,
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
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(loggingMiddleware);
    app.use(errorHandlingMiddleware);
    app.use(cors());
    app.use(setJsonContentType);
    // Error handling middleware
    app.use(errorHandler);

    await connectToMongoDB(); // Connect to MongoDB

    // Authentication middleware
    app.use(authenticate);

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
}

startApolloServer().catch((error) => {
    console.error('Error starting Apollo Server:', error);
  });