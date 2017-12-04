// function runTestForSelect() {
    console.log('select test called');
    describe('Test Select Api', function () {
        console.log('select test called 2');
        it('select all', function (done) {
            console.log('select test called 3');
            Con.select({
                From: 'Customers',
                OnSuccess: function (results) {
                    expect(results).to.be.an('array').length(91);
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            })
        });

        it('select with skip', function (done) {
            Con.select({
                From: 'Customers',
                Skip: 10,
                OnSuccess: function (results) {
                    expect(results).to.be.an('array').length(81);
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            })
        });

        it('select with where', function (done) {
            Con.select({
                From: 'Customers',
                Where: {
                    Country: 'Mexico'
                },
                OnSuccess: function (results) {
                    expect(results).to.be.an('array').length(5);
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            })
        });

        it('select with ignore case', function (done) {
            Con.select({
                From: 'Customers',
                IgnoreCase: true,
                Where: {
                    Country: 'Mexico'
                },
                OnSuccess: function (results) {
                    expect(results).to.be.an('array').length(5);
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            })
        });

        it('select with or', function (done) {
            Con.select({
                From: 'Customers',
                Where: {
                    Country: 'Mexico',
                    Or: {
                        City: 'Madrid'
                    }
                },
                OnSuccess: function (results) {
                    expect(results).to.be.an('array').length(8);
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            })
        });

        it('select with like', function (done) {
            Con.select({
                From: 'Customers',
                Where: {
                    CustomerName: {
                        Like: '%or%'
                    }
                },
                OnSuccess: function (results) {
                    expect(results).to.be.an('array').length(11);
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            })
        });

        it('select with order by', function (done) {
            Con.select({
                From: 'Customers',
                Order: {
                    By: 'Country',
                    Type: "desc"
                },
                OnSuccess: function (results) {
                    var datas;
                    expect(results).to.be.an('array').length(91);
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            })
        });
    });
// }

