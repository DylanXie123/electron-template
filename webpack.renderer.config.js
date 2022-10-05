const rules = require('./webpack.rules');
const Dotenv = require('dotenv-webpack');

rules.push(
  {
    test: /\.(s[ac]ss|css)$/i,
    use: [
      { loader: "css-loader", options: { sourceMap: true }, },
      "sass-loader",
    ],
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  }
);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    fallback: {
      path: require.resolve('path-browserify'),
    }
  },
  plugins: [
    new Dotenv(),
  ],
};
