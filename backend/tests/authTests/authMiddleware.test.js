const { authenticate } = require('../../src/middleware/authMiddleware'); // Import the authenticate function

describe('authenticate middleware', () => {
  it('should return 401 if no token is provided', () => {
    const req = {
      headers: {},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

});
