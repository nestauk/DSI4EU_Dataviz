'use strict';

var path = require('path');

module.exports = function (grunt, options) {

	var version = options.version

  	// this is the grunt configuration object
  	return {
  	
    html: [ path.join(options.folders.app, 'index.html'), path.join(options.folders.app, '**/*.html') ],
    options: {
	    blockReplacements: {
	      js: function (block) {
	      		//return '<script type="text/javascript" src="'+(block.dest + '?v='+version+'"></script>';
	      		return ''
	      },
	      css: function(block){
	      		var dest = block.dest.split('/')
	      		dest = (dest.length>1) ? dest[dest.length-1] : dest[0]
	      		return '<link href="'+dest+'?__inline=true&v='+version+'" rel="stylesheet" />';
	      }
	    }
	  }

  };

};


