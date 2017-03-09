'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    options:{
    },
    files: {
          expand: true,
          cwd: options.folders.dist,
          src: ['**/*.html'],
          dest: options.folders.dist
    }

  };

};
