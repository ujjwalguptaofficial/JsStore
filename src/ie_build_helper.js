var FILE_ENCODING = 'utf-8',

    EOL = '\n';

var { ensureDir, readFileSync, writeFileSync } = require('fs-extra');

ensureDir('bin')

function concat(opts) {

    var fileList = opts.src;
    var distPath = opts.dest;
    var out = fileList.map(function (filePath) {
        return readFileSync(filePath, FILE_ENCODING);
    });

    writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
    console.log(' ' + distPath + ' built.');
}

function uglify(srcPath, distPath) {
    var uglyfyJS = require('uglify-js');
    //     jsp = uglyfyJS.parser,
    //     pro = uglyfyJS.uglify,
    //     ast = jsp.parse(_fs.readFileSync(srcPath, FILE_ENCODING));

    // ast = pro.ast_mangle(ast);
    // ast = pro.ast_squeeze(ast);
    var output = uglyfyJS.minify(readFileSync(srcPath, {
        encoding: FILE_ENCODING
    }));
    if (output.error != null) {
        throw output.error;
    }
    writeFileSync(distPath, output.code, {
        encoding: FILE_ENCODING
    });
    console.log(' ' + distPath + ' built.');
}

//concate files

concat({
    src: [
        'node_modules/promise-polyfill/dist/polyfill.min.js',
        'src/ie_polyfill/find_index.js',
        'src/ie_polyfill/find.js'
    ],
    dest: 'bin/polyfill.all.js'
})

uglify('bin/polyfill.all.js', 'bin/polyfill.all.min.js')

concat({
    src: ['build/jsstore.worker.js',
        'bin/polyfill.all.min.js'
    ],
    dest: 'build/jsstore.worker.ie.js'
})

concat({
    src: ['build/jsstore.worker.min.js',
        'bin/polyfill.all.min.js'
    ],
    dest: 'build/jsstore.worker.ie.min.js'
})

//uglify('src/output/jsstore.worker.ie.min.js', 'src/output/jsstore.worker.ie.min.js')