'use strict';

var path = require('path');

module.exports = function (grunt, options) {

 return {

    options: {
          data: '<%= keyvar_in_data_config %>',
          ext: 'html'
        },
        files: {
          '/path/to/folder/dest': '/path/to/file_template.html'
      }
    };

};
