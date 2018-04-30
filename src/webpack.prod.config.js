const path = require('path');
const SmartBannerPlugin = require('smart-banner-webpack-plugin');
const banner = require('./license');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
module.exports = [merge(baseConfig[0], {
        output: {
            path: path.join(__dirname, "output"),
            filename: "jsstore.min.js",
            library: 'JsStore'
        },
        mode: 'production'
    }),
    merge(baseConfig[1], {
        output: {
            path: path.join(__dirname, "output"),
            filename: "jsstore.worker.min.js"
        },
        mode: 'production'
    })
]