var program = require('commander');
var files = require('../files');

program.option('-b1, --batch1', 'start the batch1').
    option('-b2, --batch2', 'start the batch2').
    option('-b3, --batch3', 'start the batch3').
    parse(process.argv);

var customLaunchers = {};
var createCustomLauncher = function (browser, platform, version, debug) {
    customLaunchers[platform + "_" + browser + "_" + version] = {
        base: 'SauceLabs',
        browserName: browser,
        platform: platform,
        version: version,
        extendedDebugging: debug,
        "record-screenshots": true,
        'seleniumVersion': '3.14.0',
        flags: [
            '--no-sandbox',
            '--headless',
            '--disable-gpu',
            '--disable-translate',
            '--disable-extensions'
        ]
    }
}

if (program.batch1) {
    createCustomLauncher('firefox', 'macOS 10.13', 'latest', true);
    createCustomLauncher('firefox', 'Windows 10', '61.0', true);
    createCustomLauncher('chrome', 'macOS 10.13', 'latest', true);

} else if (program.batch2) {
    createCustomLauncher('Safari', 'macOS 10.13', 'latest', true);
    createCustomLauncher('chrome', 'Windows 10', 'latest', true);
    createCustomLauncher('microsoftedge', 'Windows 10', 'latest', true);
    createCustomLauncher('internet explorer', 'Windows 10', 'latest', true);
}
// else {
//     // createCustomLauncher('Safari', 'iOS', 'latest', true);
//     // createCustomLauncher('chrome', 'android', 'latest', true);
// }

module.exports = function (config) {

    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
        process.exit(1)
    }
    config.set({
        basePath: '../../',
        frameworks: ['mocha', 'chai'],
        client: {
            mocha: {
                timeout: 200000
            }
        },
        browserDisconnectTimeout: 60000,
        files: ['test/karma/sauce.global.js', 'build/jsstore.min.js', 'build/jsstore.worker.min.js', ...files.list_of_files],
        proxies: {
            '/test/': '/base/test/',
            '/output/': '/base/build/'
        },
        reporters: ['mocha', 'saucelabs', 'html'],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        captureConsole: true,
        browserConsoleLogOptions: {
            terminal: false
        },
        sauceLabs: {
            testName: 'jsstore sauce lab test',
            recordScreenshots: false,
            connectOptions: {
                //port: 5757,
                logfile: 'sauce_connect.log'
            },
            // connectOptions: { // for safair and ie
            //     noSslBumpDomains: "all"
            // },
            public: 'public'
        },
        // Increase timeout in case connection in CI is slow
        captureTimeout: 240000, //120000,
        browserNoActivityTimeout: 240000,
        customLaunchers: customLaunchers,
        //browserDisconnectTolerance: 1,
        browsers: Object.keys(customLaunchers),
        concurrency: 5,
        singleRun: true,
        htmlReporter: {
            outputFile: 'report/units.html',

            // Optional
            pageTitle: 'unit Tests',
            subPageTitle: 'A sample project description',
            groupSuites: true,
            useCompactStyle: true,
            useLegacyStyle: true
        }
    })
}