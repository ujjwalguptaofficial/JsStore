describe('Test insert', function () {
    it('insert customers using promise', function (done) {
        $.getJSON("static/Customers.json", function (results) {
            Con.insert({
                Into: 'Customers',
                Values: results
            }).then(function (results) {
                expect(results).to.be.an('number').to.equal(93);
                done();
            }).
            then(function (err) {
                done(err);
            })
        });
    });

    it('insert Orders using without promise', function (done) {
        $.getJSON("static/Orders.json", function (results) {
            Con.insert({
                Into: 'Orders',
                Values: results,
                OnSuccess: function (results) {
                    expect(results).to.be.an('number').to.equal(196);
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            });
        });
    });
    
    it('insert Shippers using without promise', function (done) {
        $.getJSON("static/Shippers.json", function (results) {
            Con.insert({
                Into: 'Shippers',
                Values: results,
                OnSuccess: function (results) {
                    expect(results).to.be.an('number').to.equal(3);
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            });
        });
    });
    
    it('insert products - using Skip Data', function (done) {
        $.getJSON("static/Products.json", function (results) {
            Con.insert({
                Into: 'Products',
                Values: results,
                SkipDataCheck: true,
                OnSuccess: function (results) {
                    expect(results).to.be.an('number').to.equal(77);
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            });
        });
    });

    it('insert OrderDetails - using bulk insert', function (done) {
        $.getJSON("static/OrderDetails.json", function (results) {
            Con.bulkInsert({
                Into: 'OrderDetails',
                Values: results,
                OnSuccess: function (results) {
                    expect(results).to.be.an('undefined');
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            });
        });
    });

});