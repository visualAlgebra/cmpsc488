# cmpsc488

![A picture of an expression tree](https://github.com/visualAlgebra/cmpsc488/blob/master/src/site/assets/ExpressionTreeExample.png)

## Build Instructions

### QUICK START
If you're running on Ubuntu (or have the `gnome-terminal` command):
```shell
$ git clone https://github.com/visualAlgebra/cmpsc488.git
$ cd cmpsc488

$ npm run dev
```
Then in your browser, go to [http://localhost:8080](http://localhost:8080).

#### Quick Start Explanation
This script will install all dependencies, start the server, and make webpack watch the `site` directory for JS changes.


### Installing Dependencies
This project requires `npm`.

```shell
$ pwd # make sure you're in the `site` folder
/path/to/cmpsc488/src/site

$ npm install # this will install all the dependencies to your local machine
```

### The Hard Way:

#### Compiling with Webpack
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

#### Starting a Development Server
To start up a development server:

```shell
$ pwd # make sure you're in the project root
/path/to/cmpsc488

$ node src/server/server.js
```

Then in your browser, go to [http://localhost:8080](http://localhost:8080).
