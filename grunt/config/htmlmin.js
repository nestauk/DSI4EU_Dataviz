'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    single: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      expand: true,
      src:  path.join(options.folders.app, 'index.html'),
      dest: path.join(options.folders.app, 'index.html')
    },
    multi: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      expand: true,
      cwd: options.folders.app,
      src: ['*.html', '**/*.html', '!vendor/'], 
      dest: options.folders.app
    }

  };

};
