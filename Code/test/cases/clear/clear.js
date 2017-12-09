describe('Test clear', function () {
    it('clear customers using promise', function (done) {
        Con.clear('Customers').
        then(function (results) {
            expect(results).to.be.an('undefined');
            done();
        }).
        then(function (err) {
            done(err);
        })
    });

    it('select all Customers', function (done) {
        Con.select({
            From: 'Customers'
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(0);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it('clear Orders using without promise', function (done) {
        Con.clear('Orders', function (results) {
                expect(results).to.be.an('undefined');
                done();
            },
            function (err) {
                done(err);
            });
    });

    it('select all Orders', function (done) {
        Con.select({
            From: 'Orders'
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