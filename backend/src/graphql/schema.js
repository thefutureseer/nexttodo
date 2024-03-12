const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!

  }

  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
    userId: ID! # Associate todo with user
  }

  type Query {
    # todos: [Todo!]!
    todos(userId: ID!): [Todo!]! # Query todos by user ID

  }

  type Mutation {
    addTodo(text: String!, userId: ID!): Todo! # Include userId when adding todo
    updateTodo(id: ID!, completed: Boolean!): Todo!
    deleteTodo(id: ID!): Todo!
  }
`;

module.exports = typeDefs;
