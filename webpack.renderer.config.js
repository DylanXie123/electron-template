const rules = require('./webpack.rules');
const Dotenv = require('dotenv-webpack');
const path = require('path');

rules.push(
  {
    test: /\.(s[ac]ss|css)$/i,
    use: [
      "style-loader",
      "css-loader",
      "sass-loader",
    ],
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  }
);

module.exports = {
  module: {
    rules,
  },
  resolve: {
    alias: {
      renderer: path.resolve(__dirname, 'src/renderer')
    },
    extensions: ['.js', '.ts', '.tsx', '.json'],
    fallback: {
      path: require.resolve('path-browserify'),
    }
  },
  plugins: [
    new Dotenv(),
  ],
};
