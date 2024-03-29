const path = require('path');
const baseConfig = require('./webpack.base.config');
const { merge } = require('webpack-merge');
var webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");

function createConfigsForAllLibraryTarget() {
    const libraryTarget = [{
        type: "var",
        name: 'jsstore.min.js'
    }, {
        type: "commonjs2",
        name: 'jsstore.commonjs2.min.js'
    }];
    const getConfigForTaget = function (target) {
        return {
            output: {
                path: path.join(__dirname, "./../build"),
                filename: target.name,
                library: target.type === 'var' ? 'JsStore' : undefined,
                libraryTarget: target.type
            },
            plugins: [
                ...(
                    target.type === 'var' ?
                        [new CompressionPlugin({
                            test: /jsstore/
                        })] :
                        []
                )
            ],
            mode: "production",
            devtool: 'source-map',
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
        name: 'jsstore.worker.min.js'
    }, {
        type: "commonjs2",
        name: 'jsstore.worker.commonjs2.min.js'
    }];

    const getConfigForTaget = function (target) {
        return {

            output: {
                path: path.join(__dirname, "./../build"),
                filename: target.name,
                library: target.type === 'var' ? 'JsStoreWorker' : undefined,
                libraryTarget: target.type
            },
            plugins: [
                // new webpack.DefinePlugin({
                //     'process.env.NODE_ENV': JSON.stringify("dev")
                // }),
            ],
            mode: "production",
            devtool: 'source-map',
            optimization: {
                minimize: true,
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