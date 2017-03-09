'use strict';

var path = require('path');

module.exports = function (grunt, options) {


  return {
        options:{
            singleQuote:true
        },
        app: {
            files: {
                'public/js/app.js': [path.join(options.folders.app, 'js/app.js')]
            }
        }
    };

};

