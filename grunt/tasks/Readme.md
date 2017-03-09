
# Grunt custom tasks

This folder contains custom grunt tasks.

You can add here custom grunt tasks that will be registered by filename.
Only single task can be registered this way ( no MultiTask support ).

Example:

```js
'use strict';


module.exports = function (grunt) {
  grunt.log.success("I'm a shiny new custom task!");
};
```
