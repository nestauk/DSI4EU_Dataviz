'use strict';

/*
This task is not used in the main Grunt file since it is too slow to be effective.
An additional Grunt file has been provided, look in the README.md
*/

var path = require('path');

module.exports = function (grunt, options) {
 
  return {

    css: {
	    files: path.join(options.folders.app, 'assets/scss/*.scss'),
	    tasks: ['sass'],
	    options: {
	    }
	  }

  };

};
