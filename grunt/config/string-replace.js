'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

  	dist: {
	    files: [{
	      expand: true,
	      cwd: options.folders.dist,
	      src: '**/*.html',
	      dest: options.folders.dist
	    }],
	    options: {
	      replacements: [{
	        pattern: /<img src="(.*?)" alt="">/g,
	        replacement: function(match, p){
	        	return '<img class="lazy" src="/blog/assets/placeholder.png" data-original="'+p+'" /><noscript><img src="'+p+'" /></noscript>'
	        }
	      }]
	    }
	  }

  };

};
