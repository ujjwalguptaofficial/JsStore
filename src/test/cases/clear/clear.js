describe('Test clear', function () {
    it('clear customers using promise', function (done) {
        Con.clear('Customers').
        then(function (results) {
            expect(results).to.be.an('undefined');
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('select all Customers', function (done) {
        Con.select({
            from: 'Customers'
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('clear Orders', function (done) {
        Con.clear('Orders').then(function (results) {
            expect(results).to.be.an('undefined');
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('select all Orders', function (done) {
        Con.select({
            from: 'Orders'
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).
        catch(function (err) {
            done(err);
        })

    });

});