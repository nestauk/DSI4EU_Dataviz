/*
This task will inject into the global Grunt config file the 'people' array needed by json_templating task
*/

'use strict';

var grunt = require('grunt');
var path = require('path');

module.exports = function () {

	var rootPath = grunt.config('rootPath')
    var folders = grunt.config('folders');
	var version = grunt.config('version')

	try{
			var peopleArr = grunt.file.readJSON(path.join(folders.app, 'people/people.json'));
			peopleArr.forEach(function(p){
			var splitname = p.name.split(' ');
			p.firstname = splitname[0];
			p.lastname = splitname[1];
			p.version = version;

			grunt.config('people', peopleArr);
		})
	}catch(e){
		console.log('err', e)
	}

};