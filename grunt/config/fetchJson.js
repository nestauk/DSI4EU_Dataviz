'use strict';

module.exports = function (grunt, options) {

  var url = 'http://some/api'

 return {

    fetchSomeApi:{
      options: {
        method: 'GET',
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json'
        },
        parameters: {
          access_token: 'xxxxxxx'
        }
      },
      files: {
        'path/to/file.json': url
      }
    }

  };

};
