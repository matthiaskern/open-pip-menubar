const path = require('path');
const webpack = require('webpack');

const {dependencies} = require('./package.json');

console.log(dependencies);
module.exports = {
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },

  entry: [
    'babel-polyfill',
    path.resolve('./main.js')
  ],
  output: {
    filename: './dist/bundle.js',
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  target: 'electron-main',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      __dirname,
      'node_modules'
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin()
  ],
  externals: Object.keys(dependencies)
};
