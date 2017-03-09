'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

  options: {
      commentMarker: 'process',
      recursive:true,
      data:options,
      includeBase: options.folders.app
    },
    single:{
      dest: path.join(options.folders.app, 'index.html'),
      src:  [ path.join(options.folders.app, 'index.html') ]
    },
    multi:{
      expand: true,
      cwd: options.folders.app,
      src: ['*.html', '**/*.html'], 
      dest: options.folders.app
    }
  }

};


