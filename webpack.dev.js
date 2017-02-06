var path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: 'index.js',
  output: {
    filename: 'validation.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname)
    ],
    extensions: ['.js', '.jsx', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            'es2015',
            'react'
          ]
        }
      }
    ]
  }
}
