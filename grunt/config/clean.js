'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    dist: options.folders.dist,
    tmp:  [options.folders.tmp, options.folders.app, options.folders.grn]

  };

};
