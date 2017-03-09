'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    team: {
      files: [{
        expand: true,                  // Enable dynamic expansion
        cwd: path.join(options.folders.dist, 'people/images'),                   // Src matches are relative to this path
        src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
        dest: path.join(options.folders.dist, 'people/images')                  // Destination path prefix
      }]
    },
    dist: {
      files: [{
        expand: true,                  // Enable dynamic expansion
        cwd: path.join(options.folders.dist, 'assets/imgs'),                   // Src matches are relative to this path
        src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
        dest: path.join(options.folders.dist, 'assets/imgs')                  // Destination path prefix
      }]
    }

  };

};
