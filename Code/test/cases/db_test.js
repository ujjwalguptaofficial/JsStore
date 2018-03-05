describe('Db Test', function () {

    it('getDbList api test', function (done) {
        JsStore.getDbList(function (result) {
            console.log(result);
            expect(result).to.be.an('array').to.deep.equal(['Demo', 'MultiEntryTest']);
            done();
        });
    });

    it('drop db without promise', function (done) {
        Con.dropDb(function (results) {
                done();
            },
            function (err) {
                done(err);
            })
    });

    it('getDbList api test', function (done) {
        JsStore.getDbList(function (result) {
            console.log(result);
            expect(result).to.be.an('array').to.deep.equal(['Demo']);
            done();
        });
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

    it('getDbList api test', function (done) {
        JsStore.getDbList(function (result) {
            console.log(result);
            expect(result).to.be.an('array').to.deep.equal([]);
            done();
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