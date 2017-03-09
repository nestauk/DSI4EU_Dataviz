'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {
        myappname: { // module name
            src: [path.join(options.folders.app, 'views/*.html')],
            dest: path.join(options.folders.dist, 'js/ngtemplates.js'),
            options: {
                url: function (url) {
                    return '/' + url;
                }, // add the / in order to have absolute path
                htmlmin: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true
                }
            }
        }
    };

};
