var conWithoutWorker;
describe('Db Test', function () {

    it('getDbList api test', function (done) {
        Con.getDbList().then(function (result) {
            var dbList = ['Demo', 'MultiEntryTest', 'pinCodeDetails'];
            expect(result).to.be.an('array').to.length(3);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('getDbList api test after dropping multiIntry Table', function (done) {
        Con.dropDb().then(function () {
            Con.getDbList().then(function (result) {
                console.log(result);
                expect(result).to.be.an('array').to.deep.equal(['Demo', 'pinCodeDetails']);
                done();
            }).catch(function (err) {
                done(err);
            })
        }).catch(function (err) {
            done(err);
        });

    });

    it('open db test', function (done) {
        Con.openDb('Demo').then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('drop db test', function (done) {
        Con.dropDb().then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('getDbList api test after dropping demo', function (done) {
        Con.getDbList().then(function (result) {
            expect(result).to.be.an('array').to.deep.equal(['pinCodeDetails']);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('open db test - invalid db', function (done) {
        Con.openDb('invalid_db').then(function (results) {
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
        Con.terminate().then(function () {
            if (Con.isDbOpened_ === false) {
                done();
            } else {
                done('db is opened after terminate');
            }
        }).catch(function (err) {
            done(err);
        });
    });
});