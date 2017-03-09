'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    options: {
      base: options.folders.dist,
      message: 'Git-Pages Deploy'
    },
    'changelog': {
      options: {
        add:true
      },
      src: ['**']
    },
    'gh-pages': {
      options: {
      },
      src: ['**']
    },
    'other-staging': {
      options: {
        branch: 'gh-pages',
        repo: 'https://example.com/other/repo.git'
      },
      src: ['**']
    }


  };

};
