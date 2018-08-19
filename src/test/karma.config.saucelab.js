var files = require('./files');
module.exports = function (config) {

    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
        process.exit(1)
    }

    // Browsers to run on Sauce Labs
    // Check out https://saucelabs.com/platforms for all browser/OS combos
    var customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: '48'
        },
        sl_mac_firefox: {
            base: 'SauceLabs',
            platform: 'Windows 10',
            browserName: 'firefox',
            version: '61.0'
        },
        sl_ie_edge: {
            base: 'SauceLabs',
            browserName: 'Microsoft Edge',
            platform: 'Windows 10',
            version: 'latest'
        },
        sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '11.0'
        },
        sl_safari_10: {
            base: 'SauceLabs',
            browserName: 'Safari',
            platform: 'OS X 10.11',
            version: '9.0'
        }
    }

    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai'],
        client: {
            mocha: {
                timeout: 10000 // 6 seconds - upped from 2 seconds
            }
        },
        files: ['output/jsstore.min.js', 'output/jsstore.worker.min.js', ...files.list_of_files],
        proxies: {
            '/test/': '/base/test/',
            '/output/': '/base/output/'
        },
        reporters: ['mocha', 'saucelabs'],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        sauceLabs: {
            testName: 'jsstore sauce lab test',
            recordScreenshots: false,
            // connectOptions: {
            //     port: 5757,
            //     logfile: 'sauce_connect.log'
            // },
            public: 'public'
        },
        // Increase timeout in case connection in CI is slow
        captureTimeout: 120000,
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        singleRun: true
    })
}