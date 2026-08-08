// Setup for all tests
require('dotenv').config({ path: '.env.test', quiet: true });

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};
