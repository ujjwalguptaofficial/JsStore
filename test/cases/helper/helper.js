describe('Test helper Api', function () {

    it('isDbExist with promise', function (done) {
        Con.isDbExist("Demo").then(function (isExist) {
            expect(isExist).to.be.an('boolean').to.equal(true);
        });
        Con.isDbExist("Marvel").then(function (isExist) {
            expect(isExist).to.be.an('boolean').to.equal(false);
            done();
        });
    });

    it('getDbVersion', function (done) {
        Con.getDbVersion("Demo").then(function (version) {
            expect(version).to.be.an('number').to.equal(1);
            done();
        });
    });

    it('getDbSchema', function (done) {
        Con.getDbSchema("Demo").then(function (schema) {
            expect(schema).to.be.an('object');
            done();
        });
    });

    it('set', function (done) {
        Con.set('hello', 'world').then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });


    it('get', function (done) {
        Con.get('hello').then(function (value) {
            expect(value).to.be.an('string').equal('world');
            done();
        }).catch(function (err) {
            done(err);
        });
    });

});