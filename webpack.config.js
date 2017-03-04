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
  context: __dirname,
  module: {
    loaders: [
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader',
              options: {
                sourceMap: true,
              } },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader',
              options: {
                sourceMap: true,
              } },
          ],
        }),
      }, {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      }, {
        test: /\.svg$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'svg-url-loader',
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
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          autoprefixer({ browsers: ['last 2 versions'] }),
        ],
      },
    }),
    new ExtractTextPlugin('main.css'),
  ],
};
