'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    dist: {                            // Target
      options: {                       // Target options
        style: 'expanded'
      },
      files: [{
        expand: true,
        cwd: 'app/assets/scss',
        src: ['*.scss'],
        dest: 'app/assets/css/',
        ext: '.css'
      }]
    }

  };

};
