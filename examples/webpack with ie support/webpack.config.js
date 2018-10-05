const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/app.js',
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js|.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            
        }]
    },
    resolve: {
        extensions: ['.js']
    },
    output: {
        filename: 'scripts/bundle.js',
        path: path.resolve(__dirname, 'dist/')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};