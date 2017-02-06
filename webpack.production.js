var merge = require('webpack-merge')
var baseConfig = require('./webpack.dev.js')
var WebpackUglifyJsPlugin = require('webpack-uglify-js-plugin')
var path = require('path')

module.exports = merge(baseConfig, {
  devtool: 'source-map',
  externals: {
    'react': 'commonjs react',
    'redux': 'commonjs redux',
    'react-redux': 'commonjs react-redux'
  },
  output: {
    libraryTarget: 'umd'
  },
  plugins: [
    new WebpackUglifyJsPlugin({
      debug: true,
      minimize: true,
      sourceMap: true,
      cacheFolder: path.resolve(__dirname, 'dist/cache')
    })
  ]
})
