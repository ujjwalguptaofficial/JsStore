const { readFileSync, writeFileSync } = require('fs');

const assetsFolder = "build";

function minify(filePath) {
    console.log('minifying file', filePath);
    filePath = `${assetsFolder}/${filePath}`;
    const result = require("@babel/core").transform(readFileSync(filePath), {
        plugins: ["minify-dead-code-elimination"]
    });
    writeFileSync(filePath, result.code);
    console.log('minified file', filePath);
}

const files = [
    'jsstore.worker.js',
    // 'jsstore.worker.min.js',
    'jsstore.js',
    // 'jsstore.min.js'
];

files.forEach(function (file) {
    minify(file)
});


// console.log('result', result.code);
