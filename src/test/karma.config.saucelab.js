var files = require('./files');
module.exports = function (config) {

    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
        process.exit(1)
    }
    var customLaunchers = {};
    var createCuStomeLauncher = function (browser, platform, version, debug) {
        customLaunchers[platform + "_" + browser + "_" + version] = {
            base: 'SauceLabs',
            browserName: browser,
            platform: platform,
            version: version,
            extendedDebugging: debug
        }
    }

    createCuStomeLauncher('chrome', 'linux', 'latest', true);
    createCuStomeLauncher('firefox', 'linux', 'latest', true);
    createCuStomeLauncher('firefox', 'Windows 10', '61.0', true);
    createCuStomeLauncher('chrome', 'Windows 10', 'latest', true);
    createCuStomeLauncher('microsoftedge', 'Windows 10', 'latest', true);
    createCuStomeLauncher('internet explorer', 'Windows 8.1', '11', true);
    createCuStomeLauncher('Safari', 'macOS 10.12', '10', true);
    //createCuStomeLauncher('iPhone 8 Simulator', 'iOS 11.2', null, true);
    //createCuStomeLauncher('Android Emulator', 'Android 6.0', null, true);
    

    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai'],
        client: {
            mocha: {
                timeout: 60000
            }
        },
        files: ['output/jsstore.min.js', 'output/jsstore.worker.min.js', ...files.list_of_files],
        proxies: {
            '/test/': '/base/test/',
            '/output/': '/base/output/'
        },
        reporters: ['mocha','saucelabs','html'],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
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
        browsers: Object.keys(customLaunchers),
        singleRun: true,
        htmlReporter: {
            outputFile: 'report/units.html',

            // Optional
            pageTitle: 'Unit Tests',
            subPageTitle: 'A sample project description',
            groupSuites: true,
            useCompactStyle: true,
            useLegacyStyle: true
        }
    })
}