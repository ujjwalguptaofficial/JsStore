const path = require('path');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');

function createConfigsForAllLibraryTarget() {
    const libraryTarget = [{
        type: "var",
        name: 'jsstore.js'
    }, {
        type: "commonjs2",
        name: 'jsstore.commonjs2.js'
    }];
    const getConfigForTaget = function (target) {
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
    var configs = [];
    libraryTarget.forEach(function (target) {
        configs.push(merge(baseConfig[0], getConfigForTaget(target)));
    })
    return configs;
}



function createConfigsForAllLibraryTargetForWebWorker() {
    const libraryTargetWorker = [{
        type: "var",
        name: 'jsstore.worker.js'
    }, {
        type: "commonjs2",
        name: 'jsstore.worker.commonjs2.js'
    }];

    const getConfigForTaget = function (target) {
        return {
            devtool: 'source-map',
            output: {
                path: path.join(__dirname, "./../output"),
                filename: target.name,
                library: 'JsStoreWorker',
                libraryTarget: target.type
            }
        }
    }
    var configs = [];
    libraryTargetWorker.forEach(function (target) {
        configs.push(merge(baseConfig[1], getConfigForTaget(target)));
    })
    return configs;
}


module.exports = [...createConfigsForAllLibraryTarget(),
    ...createConfigsForAllLibraryTargetForWebWorker()
]