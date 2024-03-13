const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { authenticate } = require('./util/authMiddleware.js');
const { typeDefs, resolvers } = require('./graphql');

require('dotenv').config();

const PORT = process.env.PORT || 3001;

const dburi = process.env.MONGODB_URI

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = req.user || null;
    return { user };
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
