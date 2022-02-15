const rules = require('./webpack.rules');
const { VueLoaderPlugin } = require('vue-loader');

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
    include: /(src)/,
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
  ]
};
