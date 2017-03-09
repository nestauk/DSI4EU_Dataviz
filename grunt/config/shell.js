'use strict';

var path = require('path');

module.exports = function (grunt, options) {

  return {

    makeDir: {
        command: 'mkdir ' + path.join(options.folders.dev, 'test_aaa')
    },
    deploy_fb_staging: {
        command: 'firebase use staging && firebase deploy'
    },
    deploy_fb_production: {
        command: 'firebase use default && firebase deploy'
    }


  };

};
