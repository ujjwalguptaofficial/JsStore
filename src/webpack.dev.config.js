const path = require('path');
const SmartBannerPlugin = require('smart-banner-webpack-plugin');
const banner = require('./license');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');

module.exports = [merge(baseConfig[0], {
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "output"),
            filename: "jsstore.js",
            library: 'JsStore',
            libraryTarget:'commonjs2'
        }
    }),
    merge(baseConfig[1], {
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "output"),
            filename: "jsstore.worker.js"
        }
    })
]