describe('Test helper Api', function () {

    it('isDbExist with promise', function (done) {
        con.isDbExist("Demo").then(function (isExist) {
            expect(isExist).to.be.an('boolean').to.equal(true);
        });
        con.isDbExist("Marvel").then(function (isExist) {
            expect(isExist).to.be.an('boolean').to.equal(false);
            done();
        });
    });

    it('getDbVersion', function (done) {
        con.getDbVersion("Demo").then(function (version) {
            expect(version).to.be.an('number').to.equal(1);
            done();
        });
    });

    it('getDbSchema', function (done) {
        con.getDbSchema("Demo").then(function (schema) {
            expect(schema).to.be.an('object');
            done();
        });
    });

    it('set', function (done) {
        con.set('hello', 'world').then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });


    it('get', function (done) {
        con.get('hello').then(function (value) {
            expect(value).to.be.an('string').equal('world');
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('open invalid db', function (done) {
        con.openDb('invalid_db').then(function (value) {
            done("error in invalid db open");
        }).catch(function (err) {
            var error = { "message": "Database with name invalid_db does not exist", "type": "db_not_exist" };
            expect(err).to.be.an('object').eql(error);
            done();
        });
    })

});