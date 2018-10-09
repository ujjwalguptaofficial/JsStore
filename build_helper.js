var FILE_ENCODING = 'utf-8',

    EOL = '\n';

var fs = require('fs');

function concat(opts) {

    var fileList = opts.src;
    var distPath = opts.dest;
    var out = fileList.map(function (filePath) {
        return fs.readFileSync(filePath, FILE_ENCODING);
    });

    fs.writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
    console.log(' ' + distPath + ' built.');
}

function uglify(srcPath, distPath) {
    var
        uglyfyJS = require('uglify-js');
    //     jsp = uglyfyJS.parser,
    //     pro = uglyfyJS.uglify,
    //     ast = jsp.parse(_fs.readFileSync(srcPath, FILE_ENCODING));

    // ast = pro.ast_mangle(ast);
    // ast = pro.ast_squeeze(ast);
    var output = uglyfyJS.minify(fs.readFileSync(srcPath, FILE_ENCODING));
    fs.writeFileSync(distPath, output.code, FILE_ENCODING);
    console.log(' ' + distPath + ' built.');
}

//concate files
concat({
    src: ['src/output/jsstore.worker.min.js',
        'node_modules/promise-polyfill/dist/polyfill.min.js',
        'src/codes/ie_polyfill/find_index.js',
        'src/codes/ie_polyfill/find.js'
    ],
    dest: 'src/output/jsstore.worker.ie.min.js'
})

//uglify('src/output/jsstore.worker.ie.min.js', 'src/output/jsstore.worker.ie.min.js')