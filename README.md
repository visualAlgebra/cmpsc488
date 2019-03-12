# cmpsc488

## Build Instructions

### Cloning the Project
```shell
$ git clone https://github.com/visualAlgebra/cmpsc488.git
$ cd cmpsc488
```

### Installing Dependencies
This project requires `npm`.

```shell
$ pwd # make sure you're in the `site` folder
/path/to/cmpsc488/src/site

$ npm install # this will install all the dependencies to your local machine
```

### Compiling with Webpack
This project uses [webpack](https://webpack.js.org/) for javascript bindling and dependency managment. In order to see your changes to JS files in the browser, you must recompile the project after each change.

To recompile the javascript files **once**, run:
```shell
$ pwd # make sure you're in the `site` folder
/path/to/cmpsc488/src/site

$ npm run build
```

To **continuously recompile** whenever a change is made, run:
```shell
$ pwd # make sure you're in the `site` folder
/path/to/cmpsc488/src/site

$ npm run watch
```

### Starting a Development Server
To start up a development server:

```shell
$ pwd # make sure you're in the project root
/path/to/cmpsc488

$ node src/server/server.js
```

Then in your browser, go to [http://localhost:8080](http://localhost:8080).
