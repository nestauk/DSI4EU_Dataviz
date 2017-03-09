'use strict';

// var path = require('path');

module.exports = function (grunt, options) {

  // this is the grunt configuration object
  return {

    options: {},
    // show all available tasks
    all: {},
    // show only user defined tasks
    user: {
      options: {
        showTasks: ['user'],
        filter: 'exclude',
        // exclude this tasks
        // set beautiful descriptions
        descriptions: {
          'build': 'Build application',
          'dev':   'Starts development environment',
          'tasks': 'Show avaialble tasks. To show every possible available task run tasks:all'
        },
      }
    }

  };

};
