'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  return {

    options: {
        plugins: [
            {removeViewBox: false}, 
            {removeUselessStrokeAndFill: false}, 
            {convertTransform: false},
            {cleanupIDs:false},
            {mergePaths:false},
            {convertShapeToPath:false},
            {moveElemsAttrsToGroup:false},
            {moveGroupAttrsToElems:false}
        ]
    },
    dist: {
        files: [
        	{
		        expand: true,
		        cwd: 'tests/',
		        src: ['*.svg'],
		        dest: options.folders.dist
		    }
        ]
    }

  };

};
