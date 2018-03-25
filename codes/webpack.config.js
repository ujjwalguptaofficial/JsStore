const path = require('path');
const mode = "production";
// console.log(process.argv[1]);
module.exports = [{
        name: "jsstore",
        mode: mode,
        entry: "./jsstore_code/index.ts",
        devtool: 'source-map',
        output: {
            path: path.join(__dirname, "output/webpack_build"),
            filename: "jsstore.js",
            library: 'JsStore'
            // libraryTarget: 'umd',
        },
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
        }
    },
    {
        name: "jsstore.worker",
        mode: mode,
        devtool: 'source-map',
        entry: "./web_worker/start.ts",
        output: {
            path: path.join(__dirname, "output/webpack_build"),
            filename: "jsstore.worker.js"
        },
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
        }
    }
];