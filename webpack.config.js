const ExtractTextPlugin = require('extract-text-webpack-plugin')

var path = require('path');

const extractSass = new ExtractTextPlugin({
  filename: 'public/css/app.css'
})

function sassRules() {
  return [{
    test: /\.(sass|scss)$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'sass-loader']
    })
  }]
}

function scriptRules() {
  return [{
    test: /\.js$/,
    exclude: [/node_modules/],
    loader: 'babel-loader',
    options: {
      presets: ['@babel/env']
    }
  }]
}

module.exports = {
  entry: [
    './resources/assets/sass/app.scss',
    './resources/assets/js/app.js'
  ],
  output: {
    path: path.resolve(__dirname),
    filename: 'public/js/app.js'
  },
  module: {
    rules: sassRules().concat(scriptRules())
  },
  plugins: [
    extractSass
  ]
}
