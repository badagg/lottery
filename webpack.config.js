const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')

module.exports = {
  entry: {
    'bundle': './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  devServer: {
    port: 2233,
    host: '0.0.0.0',
    //hot: true,
    disableHostCheck: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(['dist']),
    new ExtractCssChunks({
      filename: "[name].[hash].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          ExtractCssChunks.loader,
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.less$/,
        use: [
          ExtractCssChunks.loader,
          { loader: "css-loader" },
          { loader: "less-loader" }
        ]
      }
    ]
  }
}