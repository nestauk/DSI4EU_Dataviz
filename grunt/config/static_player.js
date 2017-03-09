'use strict';

var path = require('path');

module.exports = function (grunt, options) {
  return {

  	bake:{
	    options: {
	      data: '<%= people %>',
	      basepath: options.folders.app
	    },

	    files: [
	      {
	        expand: true,
	        cwd: options.folders.app,
	        src: ['*.html', '*/*.html', '!components/*.html'], 
	        dest: options.folders.app
	      }
	    ]
	}

  };

};
