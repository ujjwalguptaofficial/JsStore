const path = require('path');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
var webpack = require('webpack');

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
            output: {
                path: path.join(__dirname, "./../build"),
                filename: target.name,
                library: 'JsStore',
                libraryTarget: target.type
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify("dev")
                }),
            ],
            mode: "production",
            devtool: 'source-map',
            optimization: {
                minimize: false
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

            output: {
                path: path.join(__dirname, "./../build"),
                filename: target.name,
                library: 'JsStoreWorker',
                libraryTarget: target.type
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify("dev")
                }),
            ],
            mode: "production",
            devtool: 'source-map',
            optimization: {
                minimize: false
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