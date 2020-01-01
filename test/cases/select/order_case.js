describe('Select with order & case', function () {

    it('order by country ', function (done) {
        con.select({
            from: 'Customers',
            limit: 10,
            order: {
                by: 'country',
                case: [{
                    '=': 'Austria',
                    then: "a"
                }, {
                    then: "b"
                }]
            }
        }).then(function (results) {
            var countries = ["Austria", "Austria", "Germany", "Mexico", "Mexico",
                "UK", "Sweden", "Germany", "France", "Spain"];
            expect(results).to.be.an('array').length(10);
            results.forEach(function (result, i) {
                expect(result.country).to.be.equal(countries[i]);
            });
            done();
        }).catch(function (err) {
            done(err);
        })
    })

    it('order by country with null as default', function (done) {
        con.select({
            from: 'Customers',
            limit: 10,
            order: {
                by: 'country',
                case: [{
                    '=': 'Austria',
                    then: "a"
                }, {
                    then: null
                }]
            }
        }).then(function (results) {
            var countries = ["Austria", "Austria", "Argentina", "Argentina", "Argentina",
                "Belgium", "Belgium", "Brazil", "Brazil", "Brazil"];
            expect(results).to.be.an('array').length(10);
            results.forEach(function (result, i) {
                expect(result.country).to.be.equal(countries[i]);
            });
            done();
        }).catch(function (err) {
            done(err);
        })
    })


    it('SELECT * FROM Customers ORDER BY (CASE WHEN City IS NULL THEN Country ELSE City END)', function (done) {
        con.select({
            from: 'Customers',
            limit: 12,
            order: {
                by: 'city',
                case: [{
                    '=': null,
                    then: {
                        column: 'Country'
                    }
                }, {
                    then: null
                }]
            }
        }).then(function (results) {
            // console.log('city results', results)
            var cities = ["Aachen", "Albuquerque", "Anchorage", "Århus", "Barcelona",
                "Barquisimeto", "Bergamo", "Berlin", "Bern", "bhubaneswar", "bhubaneswar", "Boise"];
            expect(results).to.be.an('array').length(12);
            results.forEach(function (result, i) {
                expect(result.city).to.be.equal(cities[i]);
            });
            done();
        }).catch(function (err) {
            done(err);
        })
    })

    it('order having type desc with limit', function (done) {
        con.select({
            from: 'Products',
            limit: 10,
            where: {
                supplierId: {
                    '>': 18
                }
            },
            order: {
                by: 'price',
                type: 'desc',
                case: [{
                    '<=': 20,
                    then: 1
                }, {
                    '>=': 30,
                    then: 2
                }, {
                    then: 3
                }]
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            var prices = [24, 28.5, 46, 53, 32.8, 38, 55, 34, 49.3, 18.4];
            results.forEach(function (result, i) {
                expect(result.price).to.be.equal(prices[i]);
            });
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('order having type desc with limit & case with different column', function (done) {
        con.select({
            from: 'Products',
            limit: 10,
            where: {
                supplierId: {
                    '>': 18
                }
            },
            order: [{
                by: 'price',
                type: 'desc'
            }, {
                by: 'categoryId',
                case: [{
                    '=': 1,
                    then: 1
                }, {
                    '=': 2,
                    then: 2
                }, {
                    then: 3
                }]
            }]
        }).then(function (results) {

            expect(results).to.be.an('array').length(10);
            // var prices = [55, 53, 49.3, 38, 34, 32.8, 24, 20, 28.5, 46,];
            var prices = [55, 53, 49.3, 46, 38, 34, 32.8, 28.5, 24, 20];
            results.forEach(function (result, i) {
                expect(result.price).to.be.equal(prices[i]);
            });
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('things table test', function (done) {
        con.select({
            from: 'things',
            order: {
                by: 'value',
                type: 'asc',
                idbSorting: false,
                case: [{
                    '=': 'Eggs',
                    then: 'a'
                }, {
                    then: 'b'
                }]
            }
        }).then(function (results) {
            results = results.map(function (val) {
                return val.value;
            });
            expect(results).to.be.an('array').length(10);
            var expecteResult = ['Eggs', 'nest', 'bite', 'gator', 'caYman', 'Grip',
                'grips', 'Jaw', 'crocodilian', 'Bayou'
            ];
            expect(results).to.deep.equal(expecteResult);
            done();
        }).catch(done)
    });

    // it('SELECT ProductID FROM Products ORDER BY ProductID (CASE WHEN ProductID > 20 THEN ProductID ELSE Price END);', function (done) {
    //     con.select({
    //         from: 'Products',
    //         limit: 10,
    //         order: {
    //             by: {
    //                 'productId': [{
    //                     '>': 5,
    //                     then: 'productId'
    //                 }, {
    //                     then: 'price'
    //                 }]
    //             }
    //         }
    //     }).then(function (results) {
    //         console.log('results here', results.map(val => {
    //             return val.price;
    //         }));
    //         expect(results).to.be.an('array').length(10);
    //         var prices = [25, 30, 40, 97, 10, 31, 21, 38, 6, 23.25];
    //         results.forEach(function (result, i) {
    //             expect(result.price).to.be.equal(prices[i]);
    //         });
    //         done();
    //     }).catch(function (err) {
    //         done(err);
    //     })
    // });

});