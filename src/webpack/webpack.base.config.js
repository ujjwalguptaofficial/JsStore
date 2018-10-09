const path = require('path');
const SmartBannerPlugin = require('smart-banner-webpack-plugin');
const banner = require('./../license');

module.exports = [{
        name: "jsstore",
        entry: "./src/codes/main/index.ts",
        module: {
            rules: [{
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            }]
        },
        mode: 'none',
        resolve: {
            extensions: ['.ts'] // '' is needed to find modules like "jquery"
        },
        plugins: [
            new SmartBannerPlugin(banner)
        ]
    },
    {
        name: "jsstore.worker",
        entry: "./src/codes/worker/index.ts",
        mode: 'none',
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
            extensions: ['.ts'] // '' is needed to find modules like "jquery"
        },
        plugins: [
            new SmartBannerPlugin(banner)
        ]
    }
];