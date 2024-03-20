const { addTodo } = require('./resolver'); // Import your resolver function
const { User } = require('./models'); // Import your User model

describe('addTodo resolver', () => {
  // Mock User model methods
  const mockSave = jest.fn();
  jest.spyOn(User, 'findById').mockResolvedValue({ save: mockSave });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock function calls after each test
  });

  it('should add a todo item for an authenticated user', async () => {
    // Mock input data
    const input = {
      title: 'Test Todo',
      text: 'This is a test todo item',
    };

    // Mock authenticated user
    const user = { id: 'user123' };

    // Call resolver function
    await addTodo(null, { input }, { user, User });

    // Assert that save method of User model was called with the correct arguments
    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(mockSave).toHaveBeenCalled();
  });

  it('should throw an error if user is not authenticated', async () => {
    // Mock input data
    const input = {
      title: 'Test Todo',
      text: 'This is a test todo item',
    };

    // Call resolver function without an authenticated user
    await expect(addTodo(null, { input }, { User })).rejects.toThrowError('Unauthorized');
  });

});
