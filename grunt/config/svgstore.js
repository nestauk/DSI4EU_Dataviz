'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    options: {
      prefix: 'projectName-',
      svg: {
        // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
        //viewBox : '0 0 100 100',
        xmlns: 'http://www.w3.org/2000/svg',
        id: 'svgstore'
      },
      formatting: {
        indent_size: 2
      },
    },

    dist: {
      src:  path.join(options.folders.resources, 'svgs', '*.svg'),
      dest: path.join(options.folders.dist, 'assets', 'icons.svg')
    },

    dev: {
      options: {
        includedemo: true
      },
      src:  path.join(options.folders.resources, 'svgs', '*.svg'),
      dest: path.join(options.folders.app, 'assets', 'icons.svg'),
    }

  };

};
