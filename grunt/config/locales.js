'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    options: {
    	locales: ['en_US', 'it_IT']
    },
    update: {
        src: [
            path.join(options.folders.app, '**/*.html'),
            //'js/app/**/*.js'
        ],
        dest: path.join(options.folders.app, 'locales/{locale}/i18n.json')
    },
    build: {
        src: path.join(options.folders.app, 'locales/**/i18n.json'),
        dest: 'js/locales/{locale}/i18n.js'
    },
    'export': {
        src: 'js/locales/**/i18n.json',
        dest: 'js/locales/{locale}/i18n.csv'
    },
    'import': {
        src: 'js/locales/**/i18n.csv',
        dest: 'js/locales/{locale}/i18n.json'
    }

  };

};
