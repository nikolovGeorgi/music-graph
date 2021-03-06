const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  devtool: 'source-map',
  entry: ['babel-polyfill', path.resolve(__dirname, 'src/index.jsx')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          plugins: [
            "transform-object-rest-spread",
            "transform-decorators-legacy",
            "transform-class-properties",
            "transform-regenerator"
          ],
        }
      }
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    }]
  },
  plugins: [
    new Dotenv({
      path: '../.env', // if not simply .env
      safe: false, // does not load the .env.example
      systemvars: true
    })
  ]
};
