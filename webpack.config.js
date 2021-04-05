const path = require('path');

module.exports = {
  name: 'foundryvtt-mindmap',
  entry: {
    index: './dist/foundryvtt-mindmap.js'
  },
  mode: 'development',
  devtool: 'source-map',
  output: {
    publicPath: 'modules/foundryvtt-mindmap/',
    filename: 'foundryvtt-mindmap',
    chunkFilename: 'bundles/[name].bundle.js',
    path: path.resolve(__dirname, ''),
  },
  optimization: {
    minimize: true
  }
};