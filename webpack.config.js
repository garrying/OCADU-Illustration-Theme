const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = (env, argv) => {
  const isDevelopment = argv.mode !== 'production'
  return {
    entry: {
      app: './assets/src/js/app.js',
      home: './assets/src/js/home.js'
    },
    output: {
      path: path.join(__dirname, './assets/dist/'),
      filename: '[name].js',
      assetModuleFilename: './fonts/[name][ext]',
      clean: true
    },
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'eval-source-map' : false,
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
            'postcss-loader',
            'sass-loader'
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
      new CopyWebpackPlugin({
        patterns: [{ from: './assets/src/images', to: './images' }]
      }),
      new MiniCssExtractPlugin({
        filename: 'main.css'
      })
    ],
    optimization: {
      minimize: !isDevelopment,
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
    },
    stats: 'normal'
  }
}
