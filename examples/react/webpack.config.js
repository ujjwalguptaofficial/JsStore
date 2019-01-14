var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: "sourcemap",
    entry: ["@babel/polyfill", "./src/index.js"],
    module: {
        rules: [{
            test: /\.js|.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx'] // '' is needed to find modules like "jquery"
    },
    output: {
        path: __dirname + "/dist/",
        filename: "build.min.js"
    },
    plugins: debug ? [] : [
        new webpack
        .optimize
        .DedupePlugin(),
        new webpack
        .optimize
        .OccurrenceOrderPlugin(),
        new webpack
        .optimize
        .UglifyJsPlugin({
            mangle: false,
            sourcemap: false
        })
    ]
};