/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  setupFiles: ['<rootDir>/tests/env.js'],
  globalSetup: '<rootDir>/tests/globalSetup.js',
  testMatch: ['<rootDir>/tests/**/*.test.js'],

  /**
   * Every suite shares one database, so files run one at a time. Jest's
   * default is to fan files out across workers, which would let two files
   * create and delete the same fixture rows concurrently.
   */
  maxWorkers: 1,

  // Password hashing and the reset flow are deliberately slow (bcrypt cost 10).
  testTimeout: 30000,
  verbose: true
};
