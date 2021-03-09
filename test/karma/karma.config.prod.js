process.env.CHROME_BIN = require('puppeteer').executablePath();
var files = require('../files');
var base = require('./karma.config.base');

module.exports = function (config) {
    config.set({
        ...base(config), ...{
            files: ['test/karma/prod.global.js', 'build/jsstore.min.js', 'build/jsstore.worker.min.js',
                'build/jsstore.worker.ie.min.js', ...files.list_of_files
            ],
        }
    });
}