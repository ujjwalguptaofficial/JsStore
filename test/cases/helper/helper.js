describe('Test helper Api', function () {

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
});