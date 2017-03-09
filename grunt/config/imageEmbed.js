'use strict';

var path = require('path');

module.exports = function (grunt, options) {


 return {

    dist:{
    	src: [ path.join(options.folders.dist, 'index.css') ],
	    dest: path.join(options.folders.dist, 'index.css'),
	    options: {
	        deleteAfterEncoding : false,
	        preEncodeCallback: function (filename) { return true; }
	    }
    }

  };

};
