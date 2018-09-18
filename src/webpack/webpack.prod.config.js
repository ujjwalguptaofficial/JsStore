const path = require('path');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
module.exports = [merge(baseConfig[0], {
        output: {
            path: path.join(__dirname, "./../output"),
            filename: "jsstore.min.js",
            library: 'JsStore'
        },
        mode: 'production'
    }),
    merge(baseConfig[1], {
        output: {
            library: 'JsStoreWorker',
            path: path.join(__dirname, "./../output"),
            filename: "jsstore.worker.min.js"
        },
        mode: 'production'
    }),
    merge(baseConfig[2], {
        output: {
            library: 'JsStoreWorker',
            path: path.join(__dirname, "./../output"),
            filename: "jsstore.worker.ie.min.js"
        },
        mode: 'production'
    })
]