const path = require('path');
const SmartBannerPlugin = require('smart-banner-webpack-plugin');
const banner = require('./../license');
const CopyPlugin = require('copy-webpack-plugin');

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
        new SmartBannerPlugin(banner),
        new CopyPlugin({
            patterns: [
                { from: 'build_helper', to: '' },
            ],
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
        new SmartBannerPlugin(banner)
    ]
}
];