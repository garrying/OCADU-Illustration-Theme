const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: path.join(__dirname, './assets/src/js/app.js'),
  output: {
    path: path.join(__dirname, './assets/dist/'),
    filename: 'app.js',
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader!sass-loader?sourceMap'),
      }, {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      }, {
        test: /\.svg/,
        exclude: /(node_modules|bower_components)/,
        loader: 'svg-url-loader',
      },
    ],
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ],
  plugins: [
    new ExtractTextPlugin('main.css'),
  ],
};
