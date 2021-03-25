const path = require('path');

module.exports = {
  name: 'graph',
  entry: {
    index: './src/index.js'
  },
  mode: 'development',
  devtool: 'source-map',
  output: {
    publicPath: 'modules/mindmap/',
    filename: 'graph.js',
    chunkFilename: 'bundles/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true
  }
};