module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.js'],
  modulePathIgnorePatterns: [
    '<rootDir>/app/frontend',
    '<rootDir>/gen',
    '<rootDir>/node_modules',
  ],
};
