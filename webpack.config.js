const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: './assets/src/js/app.js',
    home: './assets/src/js/home.js'
  },
  output: {
    path: path.join(__dirname, './assets/dist/'),
    filename: '[name].js',
    assetModuleFilename: './fonts/[name][ext]'
  },
  mode: 'development',
  context: __dirname,
  watchOptions: {
    ignored: '**/node_modules'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './'
            }
          },
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: './images/[name].[ext]'
        }
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/i,
        type: 'asset'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new CopyWebpackPlugin({
      patterns: [{ from: './assets/src/images', to: './images' }]
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
  ],
  stats: 'normal'
}
