
# Grunt tasks configuration files

This folder contains Grunt tasks configurations, splitted by task.

To achieve this result [load-grunt-config][1] is used.

Each grunt task has a specific file named as the task with its configuration.

You can use [`clean.js`][2] as a starting point when adding new tasks.

The `options` argument is the `appData` variable present in [`Gruntfile.js`][3]

The [`aliases.yml`][4] file is the place in which is possible to register grunt
tasks.

See `load-grunt-config` for more informations.

[1]: https://npmjs.org/package/load-grunt-config
[2]: ./clean.js
[3]: ../../Gruntfile.js
[4]: ./aliases.js
