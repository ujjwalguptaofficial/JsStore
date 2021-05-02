var conWithoutWorker;
describe('Db Test', function () {

    // it('drop db employee_db', function (done) {
    //     con.initDb(getEmployeeDbSchema()).then(function () {
    //         con.dropDb().then(function (result) {
    //             done();
    //         }).catch(done);
    //     }).catch(done);
    // });

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
                result = result.map(q => q.name);
                expect(result).to.be.an('array').to.deep.equal(['Demo', 'employee_db', 'shop']);
                done();
            }).catch(function (err) {
                done(err);
            })
        }).catch(function (err) {
            done(err);
        });

    });

    it('open db test', function (done) {
        con.initDb(getDemoDbSchema()).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(false);
            done();
        }).catch(function (err) {
            done(err);
        })
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
            result = result.map(q => q.name);
            expect(result).to.be.an('array').to.deep.equal(['employee_db', 'shop']);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('drop db shop', function (done) {
        con.initDb(getShopDbSchema()).then(function (isDbCreated) {
            expect(isDbCreated).to.be.an('boolean').equal(false);
            con.dropDb().then(function () {
                done();
            }).catch(done);
        }).catch(done);
    });

    it('getDbList api test after dropping pinCodeDetails', function (done) {
        con.getDbList().then(function (result) {
            result = result.map(q => q.name);
            expect(result).to.be.an('array').to.deep.equal(['employee_db']);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('terminate test', function (done) {
        con.terminate().then(function () {
            if (con.isConOpened_ === false) {
                done();
            } else {
                done('db is opened after terminate');
            }
        }).catch(function (err) {
            done(err);
        });
    });
});