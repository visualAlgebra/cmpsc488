const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './js/index.js',
    manipulator: './js/manipulator.js',
    creator: './js/creator.js',
    explorer: './js/explorer.js',
    profile: './js/profile.js',
    lesson_view: './js/lesson_view.js'
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};