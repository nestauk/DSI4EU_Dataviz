'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    options: {
      sourceMap: false,
      sourceMapIn: function(uglifySource) {
        return uglifySource + '.map';
      },
      compress:{
        pure_funcs: ['console.log']
      }
    },
    generated: {
      mangle:    true,  // invert for debug
      beautify:  false, // invert for debug
      sourceMap: false   // generated source maps for debug
    }

  };

};
