module.exports = () => ({
  files: [
    '**/*.js',
    '!test/**/*.test.js',
    '!node_modules/**/*.*',
    { pattern: '.env', instrument: false },
    { pattern: '.env.example', instrument: false },
  ],

  tests: [
    'test/**/*.test.js',
  ],

  workers: {
    recycle: true,
  },

  env: {
    type: 'node',
  },

  testFramework: 'mocha',
})
