const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'app');
const BUILD_DIR = path.resolve(__dirname, 'dist');
const CONTRACTS_DIR = path.resolve(__dirname, 'contracts');

const config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      contracts: CONTRACTS_DIR
    }
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)$/,
        include: APP_DIR,
        loader: 'babel-loader'
      },
      {
        test: /\.sol$/,
        include: CONTRACTS_DIR,
        loader: 'truffle-solidity-loader'
      },
      {
        test: /\.scss$/,
        include: APP_DIR,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/style.css',
      allChunks: true
    })
  ]
};

module.exports = config;
