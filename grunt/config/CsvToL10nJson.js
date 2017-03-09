'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    options: {
      // see CsvToL10nJson module options
      usePrefix: false
    },
    dist: {
      src: path.join(options.folders.resources, 'locales/*.csv'),
      dest: path.join(options.folders.dist, 'locales'),
      expand: true,
      flatten: true
    },
    dev: {
      src: path.join(options.folders.resources, 'locales/*.csv'),
      dest: path.join(options.folders.app, 'locales'),
      expand: true,
      flatten: true
    }

  };

};
