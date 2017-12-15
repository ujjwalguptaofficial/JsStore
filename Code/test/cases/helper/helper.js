describe('Test helper Api', function () {
    it('isDbExist without promise', function (done) {
        JsStore.isDbExist(DataBase.Name, function (isExist) {
            expect(isExist).to.be.an('boolean').to.equal(true);
        });
        JsStore.isDbExist("Marvel", function (isExist) {
            expect(isExist).to.be.an('boolean').to.equal(false);
            done();
        });
    });

    it('isDbExist with promise', function (done) {
        JsStore.isDbExist(DataBase.Name).then(function (isExist) {
            expect(isExist).to.be.an('boolean').to.equal(true);
        });
        JsStore.isDbExist("Marvel").then(function (isExist) {
            expect(isExist).to.be.an('boolean').to.equal(false);
            done();
        });
    });

    it('getDbVersion', function (done) {
        JsStore.getDbVersion(DataBase.Name, function (version) {
            expect(version).to.be.an('number').to.equal(1);
            done();
        });
    });

    it('getDbSchema', function (done) {
        JsStore.getDbSchema(DataBase.Name, function (schema) {
            expect(schema).to.be.an('object');
            done();
        });
    });

    it('isNull', function () {
        expect(JsStore.isNull('fuck')).to.be.an('boolean').to.equal(false);
        expect(JsStore.isNull(null)).to.be.an('boolean').to.equal(true);
        expect(JsStore.isNull('')).to.be.an('boolean').to.equal(true);
    });

});