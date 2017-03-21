const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const APP_DIR = path.resolve(__dirname, '../app');
const BUILD_DIR = path.resolve(__dirname, '../dist');
const ARTIFACT_DIR = path.resolve(__dirname, '../build/contracts');

module.exports = function() {
  return {
    entry: APP_DIR + '/index.jsx',
    output: {
      path: BUILD_DIR,
      filename: 'bundle.js',
      publicPath: '/dist/',
      sourceMapFilename: 'bundle.map'
    },
    resolve: {
      extensions: ['.jsx', '.js']
    },
    module: {
      loaders: [
        {
          test: /\.(jsx|js)$/,
          include: APP_DIR,
          loader: 'babel-loader'
        },
        {
          test: /\.scss$/,
          include: APP_DIR,
          loader: ExtractTextPlugin.extract('css-loader!sass-loader')
        },
        {
          test: /\.json$/,
          include: ARTIFACT_DIR,
          loader: 'json-loader'
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'css/style.css',
        allChunks: true
      }),
      new CopyWebpackPlugin([
        { from: APP_DIR + '/index.html', to: 'index.html' }
      ])
    ]
  };
};
