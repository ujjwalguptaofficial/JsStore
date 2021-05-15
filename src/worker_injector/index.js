module.exports = {
    setup(connection, param) {
        connection['$worker'] = (() => {
            if (process.env.NODE_ENV === 'production') {
                return require('./jsstore.worker.commonjs2.min.js');
            }
            else {
                module.exports = require('./jsstore.worker.commonjs2.js');
            }
        })();
        connection.initQueryManager_();
    }
};