const { sendServerError } = require('../utils/response');

describe('Response helpers', () => {
  it('preserves an explicit server error status code', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    sendServerError(res, 'Service unavailable.', null, 503);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Service unavailable.',
      })
    );
  });
});
