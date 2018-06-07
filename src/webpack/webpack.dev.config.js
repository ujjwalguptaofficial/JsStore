const path = require('path');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');

const libraryTarget = [{
    type: "var",
    name: 'jsstore.js'
}, {
    type: "commonjs2",
    name: 'jsstore.commonjs2.js'
}];

function getConfigForTaget(target) {
    return {
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "./../output"),
            filename: target.name,
            library: 'JsStore',
            libraryTarget: target.type
        }
    }
}

function createConfigsForAllLibraryTarget() {
    var configs = [];
    libraryTarget.forEach(function (target) {
        configs.push(merge(baseConfig[0], getConfigForTaget(target)));
    })
    return configs;
}

module.exports = [...createConfigsForAllLibraryTarget(),
    merge(baseConfig[1], {
        devtool: 'source-map',
        output: {
            library: 'JsStoreWorker',
            path: path.join(__dirname, "./../output"),
            filename: "jsstore.worker.js"
        }
    })
]