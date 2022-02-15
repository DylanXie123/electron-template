const rules = require('./webpack.rules');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'vue-style-loader' }, { loader: 'css-loader' }],
  },
  {
    test: /\.vue$/,
    use: {
      loader: 'vue-loader',
    },
  }
);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".vue", ".json", ".ts", ".tsx", ".mjs"],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    })
  ]
};
