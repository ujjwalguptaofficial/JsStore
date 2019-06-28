const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: ["@babel/polyfill", './src/app.js'],
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    // options: {
                    //     presets: ["babel-preset-env"]
                    // }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    output: {
        filename: 'scripts/bundle.js',
        path: path.resolve(__dirname, 'bin/')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};