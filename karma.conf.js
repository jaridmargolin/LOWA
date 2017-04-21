/* eslint-disable */

const path = require('path')
// Karma configuration
// Generated on Sun Apr 16 2017 16:23:55 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [{
      pattern: 'test/**/*.spec.js',
      watched: false,
      included: true,
      served: true
    }, {
      pattern: 'test/fixtures/**/*',
      included: false,
      served: true
    }],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.spec.js': ['webpack'],
      'src/**/*.js': ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage-istanbul'],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    webpack: {
      module: {
        rules: [{
          test: /\.js$/,
          include: path.resolve('src/'),
          loader: 'istanbul-instrumenter-loader'
        }]
      }
    },

    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true
    }
  })
}
