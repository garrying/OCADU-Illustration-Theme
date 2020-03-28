const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env) => {
  let envOptions = require('./webpack.env')(env);

  return {
    mode: envOptions.mode,
    entry: path.join(__dirname, './assets/src/js/app.js'),
    output: {
      path: path.join(__dirname, './assets/dist/'),
      filename: 'app.js'
    },
    context: __dirname,
    devtool: envOptions.devtool,
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          exclude: /node_modules/,
          use: envOptions.styleLoaders
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env']
          }
        }, {
          test: /\.svg$/,
          exclude: /node_modules/,
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]'
          }
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: './assets/src/images', to: './images' }
      ]),
      new MiniCssExtractPlugin({
        filename: 'main.css'
      })
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2
          }
        }
      }
    },
    stats: 'normal'
  }

}
