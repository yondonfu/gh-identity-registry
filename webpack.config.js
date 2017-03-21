const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'app');
const BUILD_DIR = path.resolve(__dirname, 'dist');
const CONTRACTS_DIR = path.resolve(__dirname, 'contracts');
const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');

const config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    publicPath: '/dist/',
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
        use: [
          { loader: 'json-loader' },
          {
            loader: 'truffle-solidity-loader',
            options: {
              migrations_directory: MIGRATIONS_DIR,
              network: 'development'
            }
          }
        ]
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
    }),
    new CopyWebpackPlugin([
      { from: APP_DIR + '/index.html', to: 'index.html' }
    ])
  ]
};

module.exports = config;
