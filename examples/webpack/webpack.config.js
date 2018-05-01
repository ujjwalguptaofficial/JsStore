const path = require('path');

module.exports = {
    entry: './src/app.js',
    devtool: 'inline-source-map',
    module: {
        rules: []
    },
    resolve: {
        extensions: ['.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/scripts')
    }
};