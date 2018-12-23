const path = require('path');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
module.exports = [merge(baseConfig[0], {
        output: {
            path: path.join(__dirname, "./../build"),
            filename: "jsstore.min.js",
            library: 'JsStore'
        },
        mode: 'production'
    }),
    merge(baseConfig[1], {
        output: {
            library: 'JsStoreWorker',
            path: path.join(__dirname, "./../build"),
            filename: "jsstore.worker.min.js"
        },
        mode: 'production'
    })
]