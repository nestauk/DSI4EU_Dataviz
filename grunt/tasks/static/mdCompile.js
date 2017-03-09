'use strict';

var grunt = require('grunt');
var path = require('path');

var Builder = require('./lib/builder.js');

module.exports = function () {
  var builder;
  var done = this.async();

  var rootPath = grunt.config('rootPath');
  var folders = grunt.config('folders');

  try {
    builder = new Builder({
      root: rootPath,
      paths: {
        build   : folders.dist,
        data    : path.join(folders.app, 'datas'),
        layout  : path.join(folders.app, 'views/layouts'),
        source  : path.join(folders.app, 'sources'),
        template: path.join(folders.app, 'views/templates'),
      },
      customFilters: require(path.join(rootPath, folders.app, 'filters.js'))
    });
    builder.registerPage('users')
      .catch(function (err) {
        console.log(err);
        console.log(err.stack);
      });
    // builder.registerPage('users/user 1');
  }
  catch (e) {
    console.log(e);
    console.log(e.stack);
  }

  builder.build()
    .then(function (result) {
      grunt.log.success('Build done');
    })
    .catch(function (error) {
      grunt.fail.fatal(error);
    })
    .finally(function () {
      done();
    });
};
