const contextSetup = async ({ req, res }) => {
    console.log("this is first req in context: ", req)
  // Extract user from request object (attached by authentication middleware)
  let currentUser = req.currentUser;
  console.log('this is req  -Extract context file function user from request object authmiddle line 5 ', currentUser)

    // Dynamically allow all queries and mutations
    const allowedQueries = ['currentUser', 'todos']; // Add other allowed queries here
    const allowedMutations = ['signUp', 'signIn', 'addTodo', 'updateTodo', 'deleteTodo']; // Add other allowed mutations here

    // Construct context object with allowed queries and mutations
    const contextObject = {
        currentUser,
        allow: {
            queries: allowedQueries.reduce((acc, query) => ({ ...acc, [query]: true }), {}),
            mutations: allowedMutations.reduce((acc, mutation) => ({ ...acc, [mutation]: true }), {})
        }
    };
    console.log("this is context Object from context file: ", contextObject);
    console.log("this is context Object.currentUser from context file: ", currentUser);

    return contextObject;
}; // Return the constructed context object
module.exports = {contextSetup};