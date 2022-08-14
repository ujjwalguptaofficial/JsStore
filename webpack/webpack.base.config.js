const path = require('path');
const webpack = require('webpack');
const banner = require('./../license');
const CopyPlugin = require('copy-webpack-plugin');

console.log('building for', process.env.NODE_ENV);

module.exports = [{
    name: "jsstore",
    entry: "./src/main/index.ts",
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader'
            }
        }]
    },
    resolve: {
        // alias: {
        //     "@": path.resolve(__dirname, "../src"),
        //     "@worker": path.resolve(__dirname, "../src/worker")
        // },
        extensions: ['.ts'] // '' is needed to find modules like "jquery"
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new CopyPlugin({
            patterns: [
                { from: 'build_helper', to: '' },
                { from: 'src/worker_injector', to: 'worker_injector' },
            ],
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV
            )
        }),
    ]
},
{
    name: "jsstore.worker",
    entry: "./src/worker/index.ts",
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader'
            }
        }]
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "../src"),
            "@worker": path.resolve(__dirname, "../src/worker"),
            "@executors": path.resolve(__dirname, "../src/worker/executors")
        },
        extensions: ['.ts'] // '' is needed to find modules like "jquery"
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV
            )
        }),
    ]
}
];