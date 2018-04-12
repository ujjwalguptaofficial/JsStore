const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = {
    plugins: [
      new CopyWebpackPlugin([ ...patterns ], options)
    ]
  }