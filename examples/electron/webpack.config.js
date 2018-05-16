const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [{
    entry: './src/electron/index.js',
    devtool: 'inline-source-map',
    module: {
        rules: []
    },
    resolve: {
        extensions: ['.js']
    },
    output: {
        filename: 'scripts/app.js',
        path: path.resolve(__dirname, 'dist/')
    },
    mode: "development",
    target: 'electron-renderer',
    node: {
        __dirname: false,
        __filename: false
    }
}, {
    entry: './src/app/index.js',
    devtool: 'inline-source-map',
    module: {
        rules: []
    },
    resolve: {
        extensions: ['.js']
    },
    output: {
        filename: 'scripts/renderer.js',
        path: path.resolve(__dirname, 'dist/')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ],
    mode: "development"
}];