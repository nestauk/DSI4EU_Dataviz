'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    app:{
      files:[
        {
          expand: true,
          cwd: options.folders.dev,
          src: ['**/*'], 
          dest: path.join(options.folders.app, '')
        }
      ]
    },

    ver:{
      files:[
        {
          expand: true,
          cwd: options.folders.dist,
          src: ['**/*'], 
          dest: path.join(options.folders.dist, options.version)
        }
      ]
    },

    dist: {
      files: [
        {
          expand: true,
          cwd: options.folders.app,
          src:  ['*.html', '**/*.html', 'data/*', '!node_modules/**/*'],
          dest: options.folders.dist
        },
        {
          expand: true,
          cwd: options.folders.app,
          src:  path.join('img', 'ui', '*.{svg,jpg,png,bmp,gif}'),
          dest: path.join(options.folders.dist)
        },
        {
          expand: true,
          cwd: path.join(options.folders.app, 'css'),
          src:  path.join('fonts', '*'),
          dest: path.join(options.folders.dist)
        }
      ]
    },

  };

};
