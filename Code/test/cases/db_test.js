describe('Db Test', function () {

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

    it('open db test - invalid db', function (done) {
        Con.openDb('invalid_db', function (results) {
                done();
            },
            function (err) {
                var error = {
                    "_message": "Database 'invalid_db' does not exist",
                    "_type": "db_not_exist"
                };
                expect(err).to.be.an('object').eql(error);
                done();
            }
        )
    });
});