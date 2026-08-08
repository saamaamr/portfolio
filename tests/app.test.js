const express = require('express');

jest.mock('../services/email', () => ({
  sendContactEmail: jest.fn(),
}));

describe('Express application lifecycle', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('does not open a network listener when the app module is imported', () => {
    const server = {
      on: jest.fn(),
      close: jest.fn(),
    };
    const listenSpy = jest
      .spyOn(express.application, 'listen')
      .mockReturnValue(server);

    const app = require('../app');

    expect(typeof app).toBe('function');
    expect(listenSpy).not.toHaveBeenCalled();
  });
});
