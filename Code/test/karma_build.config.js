process.env.CHROME_BIN = require('puppeteer').executablePath();
var files = require('./files');
module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        client: {
            mocha: {
                timeout: 2000 // 6 seconds - upped from 2 seconds
            }
        },
        files: files.list_of_files,
        proxies: {
            '/static/': '/base/static/',
            '/cases/': '/base/cases/'
        },
        reporters: ['mocha'],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['HeadlessChrome'],
        customLaunchers: {
            HeadlessChrome: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--headless',
                    '--disable-gpu',
                    '--disable-translate',
                    '--disable-extensions'
                ]
            }
        },
        autoWatch: false,
        // concurrency: Infinity,
        // singleRun: false,
        singleRun: true,
        browserNoActivityTimeout: 120000,
    })
}