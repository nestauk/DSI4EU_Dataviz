'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {
  	options: {
      // map: true, // inline sourcemaps

      // or
      /*map: {
          inline: false, // save all sourcemaps as separate files...
          annotation: 'dist/css/maps/' // ...to the specified directory
      },*/

      processors: [
        require('pixrem')(), // add fallbacks for rem units
        require('autoprefixer')({browsers: 'last 3 versions'}), // add vendor prefixes
        require('cssnano')() // minify the result
      ]
    },
    dist: {
      src:  [path.join(options.folders.tmp, 'concat/**/*.css' ), path.join(options.folders.tmp, 'concat/*.css' )],
      //dest: path.join(options.folders.tmp, 'concat/css/app.css' ),
    }

  };

};
