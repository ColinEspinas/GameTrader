const MiniCssExtractPlugin = require('mini-css-extract-plugin')
var path = require('path');

const extractSass = new MiniCssExtractPlugin({
  filename: 'public/css/app.css'
})

function sassRules() {
  return [{
    test: /\.(sa|sc|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      { loader: 'css-loader' },
      { loader: 'sass-loader' }
    ],
  }]
}

// function scriptRules() {
//   return [{
//     test: /\.js$/,
//     exclude: [/node_modules/],
//     loader: 'babel-loader',
//     options: {
//       presets: ['@babel/env']
//     }
//   }]
// }

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
    rules: sassRules()
  },
  plugins: [
    extractSass
  ]
}
