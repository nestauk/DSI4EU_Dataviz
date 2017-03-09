'use strict';

var grunt = require('grunt');
var path = require('path');
var fs = require('fs');

module.exports = function () {

	var rootPath = grunt.config('rootPath')
    var folders = grunt.config('folders');
	var version = grunt.config('version')

	var str = '<html><head><title>...</title><meta http-equiv="refresh" content="0;URL=\''+version+'/\'" /></head><body></body></html>'

	/*
	var dir = path.join(folders.app, '')
	var list = fs.readdirSync(dir)
	var str = '<html><head><title>...</title></head><body><ul>'
	list.forEach(function(d, i){
		str += '<li><a href="'+d+'/">'+d+'</a></li>'
	})
	str += '</ul></body></html>'
	*/

	grunt.file.write(path.join(folders.dist, 'index.html'), str);

};