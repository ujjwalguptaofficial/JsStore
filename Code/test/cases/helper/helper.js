describe('Test helper Api', function () {
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