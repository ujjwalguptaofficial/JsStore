describe('Test clear', function () {

    it('check autoincrment field before reset', function (done) {
        con.get("JsStore_DbSchema").then(result => {
            const table = result.tables.find(q => q.name === 'Customers');
            expect(table.autoIncColumnValue).to.haveOwnProperty("customerId", 96);
            done();
        }).catch(done)
    })

    it('clear customers using promise', function (done) {
        con.clear('Customers').
            then(function (results) {
                expect(results).to.be.an('undefined');
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select all Customers', function (done) {
        con.select({
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

    it('check autoincrment field reset', function (done) {
        con.get("JsStore_DbSchema").then(result => {
            const table = result.tables.find(q => q.name === 'Customers');
            expect(table.autoIncColumnValue).to.haveOwnProperty("customerId", 0);
            done();
        }).catch(done)
    })

    it('select all Customers with aggregate', function (done) {
        con.select({
            from: 'Customers',
            aggregate: {
                min: 'customerId'
            }
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
        con.clear('Orders').then(function (results) {
            expect(results).to.be.an('undefined');
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('select all Orders', function (done) {
        con.select({
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