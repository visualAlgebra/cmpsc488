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
$ pwd
/path/to/cmpsc488

$ npm install # this will install all the dependencies to your local machine
```

### Starting a Development Server
To start up a development server:

#### If you have Python 2 installed:
```shell
$ pwd
/path/to/cmpsc488

$ python -m SimpleHTTPServer 8000
```
#### If you have Python 3 installed:
```shell
$ pwd
/path/to/cmpsc488

$ python -m http.server 8000
```

The in your browser, go to [http://localhost:8000](http://localhost:8000).

If you don't use a development server, some javascript stuff may not work!
