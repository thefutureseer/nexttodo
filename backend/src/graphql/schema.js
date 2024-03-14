const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define the User type representing a user in the system
  type User {
    id: ID!             # Unique identifier for the user
    username: String!   # User's username
    email: String!      # User's email address
  }

  # Define the Todo type representing a to-do item
  type Todo {
    id: ID!             # Unique identifier for the to-do item
    text: String!       # Text content of the to-do
    completed: Boolean! # Indicates whether the to-do is completed
    user: User!         # Directly reference the user object associated with the todo.
    userId: ID!         # Associate todo with user
  }

  # Define the AuthPayload type representing the result of user authentication
  type AuthPayload {
    token: String!      # JWT token generated upon successful authentication
    user: User!         # User object associated with the token
  }

  # Define the Query type for fetching data
  type Query {
    userTodos: [Todo]!                 # Fetch all to-dos for the current user
    todosByUserId(userId: ID!): [Todo] # Fetch all to-dos for a specific user
    todos: [Todo]!                     # Fetch all to-dos (for all users)
    users: [User]!                     # Fetch all users
  }

  # Define input types for mutation arguments
  input SignUpInput {
    name: String!     # User's name
    email: String!    # User's email address
    password: String! # User's password
  }

  input SignInInput {
    email: String!    # User's email address
    password: String! # User's password
  }

  input AddTodoInput {
    text: String!     # Text content of the to-do
    userId: ID!       # ID of the user associated with the to-do
  }

  input UpdateTodoInput {
    id: ID!           # ID of the to-do item to update
    text: String      # New text content of the to-do (optional)
    completed: Boolean # New completion status of the to-do (optional)
  }

  # Define the Mutation type for performing operations that modify data
  type Mutation {
    signUp(input: SignUpInput!): User!           # User sign-up operation
    signIn(input: SignInInput!): AuthPayload!    # User sign-in operation
    addTodo(input: AddTodoInput!): Todo!         # Add a new to-do item
    updateTodo(input: UpdateTodoInput!): Todo!   # Update an existing to-do item
    deleteTodo(id: ID!): Todo!                   # Delete a to-do item
  }
`;

module.exports = typeDefs;
