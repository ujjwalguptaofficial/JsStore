describe('Drop Db Test', function () {
    it('drop db without promise', function (done) {
        Con.dropDb(function (results) {
                done();
            },
            function (err) {
                done(err);
            })
    });

    it('drop db with promise', function (done) {
        Con.openDb('Demo').
        dropDb().
        then(function (results) {
            done();
        }).catch(
            function (err) {
                done(err);
            });
    });
});