const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { Todo } = require('./models'); // Require the Todo model
const { authenticate } = require('./util/authMiddleware.js');
const { typeDefs, resolvers } = require('./graphql/index');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3001;

const dburi = process.env.MONGODB_URI

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = req.user || null;
    return { user, Todo };
  },
  formatError: (error) => {
    const { message, path } = error;
    return { message, path };
  },
});

async function startApolloServer() {
  // Start the Apollo Server instance
  await server.start();

  const app = express();

  // Enable CORS middleware
  app.use(cors(
    {
    origin: '*', // Allow requests from any origin, or specify your allowed origins
    methods: ['GET', 'POST'], // Allow GET and POST requests
    credentials: true, // Allow credentials to be sent with requests (if needed)
  }
  ));

  app.use(authenticate);

  // Apply Apollo Server middleware to Express app
  server.applyMiddleware({ app });

  // Connect to MongoDB
  mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
      // Start Express server
      app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}/graphql`);
      });
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });
}

startApolloServer().catch((error) => {
  console.error('Error starting Apollo Server:', error);
});
