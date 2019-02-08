var conWithoutWorker;
describe('Db Test', function () {

    it('getDbList api test', function (done) {
        con.getDbList().then(function (result) {
            expect(result).to.be.an('array').to.length(4);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('getDbList api test after dropping multiIntry Table', function (done) {
        con.dropDb().then(function () {
            con.getDbList().then(function (result) {
                console.log(result);
                expect(result).to.be.an('array').to.deep.equal(['Demo', 'shop', 'pinCodeDetails']);
                done();
            }).catch(function (err) {
                done(err);
            })
        }).catch(function (err) {
            done(err);
        });

    });

    it('open db test', function (done) {
        con.openDb('Demo').then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('drop db test', function (done) {
        con.dropDb().then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('getDbList api test after dropping demo', function (done) {
        con.getDbList().then(function (result) {
            expect(result).to.be.an('array').to.deep.equal(['shop', 'pinCodeDetails']);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('drop db test', function (done) {
        con.openDb('pinCodeDetails').then(function () {
            con.dropDb().then(function () {
                done();
            }).catch(function (err) {
                done(err);
            });
        })
    });

    it('getDbList api test after dropping pinCodeDetails', function (done) {
        con.getDbList().then(function (result) {
            expect(result).to.be.an('array').to.deep.equal(['shop']);
            done();
        }).catch(function (err) {
            done(err);
        });
    });


    it('open db test - invalid db', function (done) {
        con.openDb('invalid_db').then(function (results) {
            done();
        }).catch(function (err) {
            var error = {
                "message": "Database 'invalid_db' does not exist",
                "type": "db_not_exist"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });

    it('terminate test', function (done) {
        con.terminate().then(function () {
            if (con.isDbOpened_ === false) {
                done();
            } else {
                done('db is opened after terminate');
            }
        }).catch(function (err) {
            done(err);
        });
    });
});