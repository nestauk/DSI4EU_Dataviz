# DSI4EU Dataviz application

The software is a static SPA that needs to be built with a custom grunt toolchain.  
It is designed to be responsive in order to support both the mobile and the embedded version a well. 

It does include a permalink mechanism allowing to share specific application states as well as to ease the internal embedding (i.e. within each org profile page).

The application will gather the dataset through two API calls.

## First setup

```
npm install
```

## Start a development session

	grunt dev

[http://localhost:3000](http://localhost:3000)

## Build locally

	grunt build

## Check locally

	http-server
[http://localhost:8080](http://localhost:8080)

## Build for release

```
npm version patch
grunt build
```

## 

---

## Embed code

The embed code can be used to embed a specific application view. Some parameters can be configured, see below:

```html
<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='http://dsitest.todo.to.it/viz/#/network?l=0&e=1&org=267' style='border:0'></iframe></div>
```

Available params:

- org=<organization_id>
- prj=<project_id>