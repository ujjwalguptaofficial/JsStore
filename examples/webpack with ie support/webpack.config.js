const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/app.js',
    mode: 'development',
    devtool: 'source-map',
    module: {
         
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