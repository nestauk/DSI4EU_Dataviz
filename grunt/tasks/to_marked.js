
'use strict';

var grunt = require('grunt');
var path = require('path');
var marked = require('marked');

module.exports = function () {


	// example of reading a local json file, iterate over an array in order to transform some content from .md to .html
	// then saving the json file again

    var folders = grunt.config('folders');

	try{
		var projects = grunt.file.readJSON(path.join(folders.dev, 'myfile.json'));
		projects.items.forEach(function(p){
			p.some_key = marked(p.some_key)
		})
		grunt.file.write(path.join(folders.dev, 'myfile.json'), JSON.stringify(projects));
	}catch(e){
		console.log('err', e)
	}

};