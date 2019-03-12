const path = require('path');

module.exports = {
  entry: {
    home: './js/index.js',
    manipulator: './js/manipulator.js',
    creator: './js/creator.js',
    explorer: './js/explorer.js',
    profile: './js/profile.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};