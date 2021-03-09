if (process.env.NODE_ENV === 'production') {
    module.exports = require('./jsstore.commonjs2.min.js');
}
else {
    module.exports = require('./jsstore.commonjs2.js');
}
