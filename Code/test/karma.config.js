process.env.CHROME_BIN = require('puppeteer').executablePath()
module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        client: {
            mocha: {
                timeout: 20000 // 6 seconds - upped from 2 seconds
            }
        },
        files: [
            'scripts/jquery-3.2.1.min.js',
            '../output/jsstore.js',
            'scripts/dbhelper.js',
            'cases/insert/*.js',
            'cases/count/*.js',
            'cases/select/*.js',
            'cases/update/*.js',
            'cases/delete/*.js',
            'cases/helper/*.js',
            'cases/clear/*.js',
            'cases/column_option/*.js',
            'cases/drop_db.js',
            {
                pattern: 'static/*.json',
                included: false,
                served: true,
            },
            'setup.js'
        ],
        proxies: {
            '/static/': '/base/static/',
            '/cases/': '/base/cases/'
        },
        reporters: ['mocha'],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        customLaunchers: {
            HeadlessChrome: {
                base: 'ChromeHeadless',
                flags: [
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