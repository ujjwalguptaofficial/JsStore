process.env.CHROME_BIN = require('puppeteer').executablePath();
var files = require('../files');
var base = require('./karma.config.base');
module.exports = function (config) {
    config.set({
        ...base(config), ...{
            files: [
                ...files.list_of_files
            ],
        }
    })
}