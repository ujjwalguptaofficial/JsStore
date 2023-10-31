describe('Test helper Api', function () {

    it('set', function (done) {
        con.set('hello', 'world').then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('set', function (done) {
        con.Map.set('ujjwal', 'gupta').then(function () {
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

    it('has', function (done) {
        con.Map.has('hello').then(function (value) {
            expect(value).to.be.an('boolean').equal(true);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('delete', function (done) {
        con.Map.delete('hello').then(function (value) {
            expect(value).to.be.an('undefined').equal(undefined);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('has after delete', function (done) {
        con.Map.has('hello').then(function (value) {
            expect(value).to.be.an('boolean').equal(false);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('delete not existing key', function (done) {
        con.Map.delete('hello').then(function (value) {
            expect(value).to.be.an('undefined').equal(undefined);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('get after delete', function (done) {
        con.Map.get('hello').then(function (value) {
            expect(value).to.be.an('undefined').equal(undefined);
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('has after delete which is not deleted', function (done) {
        con.Map.has('ujjwal').then(function (value) {
            expect(value).to.be.an('boolean').equal(true);
            done();
        }).catch(function (err) {
            done(err);
        });
    });
});