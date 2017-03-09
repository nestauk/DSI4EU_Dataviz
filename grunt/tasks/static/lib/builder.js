'use strict';

var path   = require('path');
var _      = require('lodash');
var util   = require('util');
var grunt  = require('grunt');
var fse    = require('fs-extra');
var Q      = require('q');
var fm     = require('front-matter');
var Liquid = require('liquid-node');
var marked = require('marked');


function Builder (options) {
  this.pages = [];

  if (_.isUndefined(options)) {
    options = {};
  }

  this.options = _.defaultsDeep({}, options, {
    root: process.cwd(),
    paths : {
      build   : 'build',
      data    : 'datas',
      layout  : 'views/layouts',
      source  : 'sources',
      template: 'views/templates',
    },
    customFilters: {}
  });

  grunt.verbose.debug(util.inspect(this.options));

  this.options.paths.build = path.join(this.options.root, this.options.paths.build);
  this.options.paths.data = path.join(this.options.root, this.options.paths.data);
  this.options.paths.layout = path.join(this.options.root, this.options.paths.layout);
  this.options.paths.source = path.join(this.options.root, this.options.paths.source);
  this.options.paths.template = path.join(this.options.root, this.options.paths.template);

  // create Liquid engine
  this.liquidEngine = new Liquid.Engine();
  // permit includes ( see https://github.com/sirlantis/liquid-node/issues/24 )
  this.liquidEngine.registerFileSystem(new Liquid.LocalFileSystem(this.options.paths.template));
}

module.exports = Builder;

Builder.prototype.registerPage = function registerPage (pageName) {
  var self = this;
  return Q.promise(function (resolve, reject) {
    var page = {
      name: null,
      path: null,
      data: null,
      attr: null,
      body: null
    };

    // verify source exists
    var p = self._generatePath(pageName, 'source');
    try {
      fse.accessSync(p);
    }
    catch (e) {
      // if ENOENT we should warn user properly and reject
      if (e.code === 'ENOENT') {
        var err = Error(util.format('Page %s cannot be located at %s', pageName, p));
        grunt.fail.warn(err);
        return reject(err);
      }
      // else we should warn
      else {
        grunt.fail.warn(e);
        return reject(e);
      }
    }

    grunt.log.writeln(util.format('Registering page: %s [%s]', pageName, p));

    // save page name
    page.name = pageName;

    // save source path
    page.path = p;

    // get front matter
    grunt.verbose.writeln('  > Reading front matter');
    var content  = fm(grunt.file.read(page.path));
    page.attr = content.attributes;
    if (!page.attr.title) {
      var err = Error(util.format('Title is missing for page %s', pageName));
      grunt.fail.warn(err);
      return reject(err);
    }
    page.body = content.body;

    // verify if data path exists
    p = self._generatePath(pageName, 'data');
    try {
      fse.accessSync(p);
      grunt.verbose.writeln('  > Registering data');
      page.data = JSON.parse(grunt.file.read(p));
    }
    catch (e) {
      // warn only if the error wasn't ENOENT
      if (e.code !== 'ENOENT') {
        grunt.fail.warn(e);
        return reject(e);
      }
    }

    // save page
    self.pages.push(page);
    // resolve
    resolve({lastAdded: page, pages: self.pages});
  });
};

Builder.prototype.build = function build (pageName) {
  var self = this;
  var promises = [];

  if (pageName) {
    var page = _.find(self.pages, 'name', pageName);
    promises.push(self._buildPage(page));
  }
  else {
    _.each(self.pages, function (page) {
      promises.push(self._buildPage(page));
    });
  }

  return Q.all(promises);
};

Builder.prototype._generatePath = function _generatePath (_path, type) {
  var self = this;
  switch (type) {
    case 'build':
      return path.join(self.options.paths.build, _path);
    case 'data':
      return path.join(self.options.paths.data, _path + '.json');
    case 'layout':
      return path.join(self.options.paths.layout, _path + '.html');
    case 'source':
      return path.join(self.options.paths.source, _path + '.md');
    case 'template':
      return path.join(self.options.paths.template, _path + '.html');
    default:
      return null;
  }
};

Builder.prototype._buildPage = function _buildPage (page) {
  var self = this;

  grunt.log.debug(util.format('Current page: %s', util.inspect(page)));

  return Q.promise(function (resolve, reject) {
    grunt.log.writeln(util.format('Rendering %s', page.name));

    // parse markdown
    var content = marked(page.body);
    // generate template path
    var template = self._generatePath(page.attr.template, 'template');
    // read file
    template = grunt.file.read(template);
    // generate layout path
    var layout = self._generatePath(page.attr.layout, 'layout');
    // read file
    layout = grunt.file.read(layout);
    var predefFilters = require('./filters');
    // register predefined filters
    self.liquidEngine.registerFilters(predefFilters);
    // load custom filters
    var customFilters = self.options.customFilters;
    // register custom filters
    self.liquidEngine.registerFilters(customFilters);

    self.liquidEngine.parseAndRender(content)
      .then(function(content) {
        return self.liquidEngine.parseAndRender(template, { currentPage: page, content: content });
      })
      .then(function(template) {
        return self.liquidEngine.parseAndRender(layout, { currentPage: page, title: page.attr.title, body: template });
      })
      .then(function(layout) {
        grunt.file.write(self._generatePath(page.name + '.html', 'build'), layout);
        return resolve(page);
      })
      .catch(function (err) {
        return reject(err);
      });
  });
};
