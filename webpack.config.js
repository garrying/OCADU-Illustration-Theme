const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, './assets/src/js/app.js'),
  output: {
    path: path.join(__dirname, './assets/dist/'),
    filename: 'app.js',
  },
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loader: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        }),
      }, {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
        },
      }, {
        test: /\.svg$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './assets/src/images', to: './images' },
    ]),
    new ExtractTextPlugin('main.css'),
  ],
};
