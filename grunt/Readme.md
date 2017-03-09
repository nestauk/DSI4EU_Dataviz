
# Grunt configuration

This folder contains custom grunt tasks and custom configuration.

The loading of these files is performed by [Gruntfile.js][1] using `load-grunt-config`
and custom `registerTasks` functions.

```
.grunt
├── config
└── tasks
```

The [`config`][2] folder is used to store `load-grunt-config` configuration files,
as per `load-grunt-config` documentation.

The [`tasks`][3] folder is used to store `register-grunt-tasks` custom tasks files,
as per `register-grunt-tasks` documentation.

[1]: ../Gruntfile.js
[2]: ./config
[3]: ./tasks
