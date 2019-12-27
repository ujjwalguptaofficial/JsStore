describe('Test Select Api with case', function () {
    it('select all', function (done) {
        con.select({
            from: 'Customers',
            case: {
                city: [{
                    '=': 'London',
                    then: 'London UK'
                }, {
                    then: 'World'
                }]
            }
        }).then(function (results) {
            var londonCount = 0;
            var worldCount = 0;
            results.forEach(function (result) {
                if (result.city === 'London UK') {
                    londonCount++;
                }
                else if (result.city === 'World') {
                    worldCount++;
                }
            })
            expect(results).to.be.an('array').length(93);
            expect(londonCount).to.be.equal(6);
            expect(worldCount).to.be.equal(87);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with skip', function (done) {
        con.select({
            from: 'Customers',
            skip: 10,
            case: {
                city: [{
                    '=': 'London',
                    then: 'London UK'
                }, {
                    then: 'World'
                }]
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(83);
            var londonCount = 0;
            var worldCount = 0;
            results.forEach(function (result) {
                if (result.city === 'London UK') {
                    londonCount++;
                }
                else if (result.city === 'World') {
                    worldCount++;
                }
            })
            expect(londonCount).to.be.equal(5);
            expect(worldCount).to.be.equal(78);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with or', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: 'Mexico',
                or: {
                    city: 'Madrid'
                }
            },
            case: {
                country: [{
                    '!=': 'Spain',
                    then: 'Not Spain'
                }, {
                    then: 'I m Spain'
                }]
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(8);
            var spainCount = 0;
            var notSpainCount = 0;
            results.forEach(function (result) {
                if (result.country === 'I m Spain') {
                    spainCount++;
                }
                else if (result.country === 'Not Spain') {
                    notSpainCount++;
                }
            })
            expect(spainCount).to.be.equal(3);
            expect(notSpainCount).to.be.equal(5);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with in', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: {
                    in: ['Germany', 'France', 'UK']
                }
            },
            case: {
                country: [{
                    '=': 'UK',
                    then: 'U.K.'
                }, {
                    then: 'World'
                }]
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(29);
            var ukCount = 0;
            var worldCount = 0;
            results.forEach(function (result) {
                if (result.country === 'U.K.') {
                    ukCount++;
                }
                else if (result.country === 'World') {
                    worldCount++;
                }
            })
            expect(ukCount).to.be.equal(7);
            expect(worldCount).to.be.equal(22);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with like -"%or%"', function (done) {
        con.select({
            from: 'Customers',
            where: {
                customerName: {
                    like: '%or%'
                }
            },
            case: {
                country: [{
                    '=': 'UK',
                    then: 'U.K.'
                }, {
                    then: 'World'
                }]
            }
        }).then(function (results) {
            var ukCount = 0;
            var worldCount = 0;
            results.forEach(function (result) {
                if (result.country === 'U.K.') {
                    ukCount++;
                }
                else if (result.country === 'World') {
                    worldCount++;
                }
            })
            expect(ukCount).to.be.equal(3);
            expect(worldCount).to.be.equal(8);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with GroupBy', function (done) {
        con.select({
            from: 'Customers',
            groupBy: "country",
            case: {
                country: [{
                    '=': 'UK',
                    then: 'U.K.'
                }, {
                    then: 'World'
                }]
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(2);
            var ukCount = 0;
            var worldCount = 0;
            results.forEach(function (result) {
                if (result.country === 'U.K.') {
                    ukCount++;
                }
                else if (result.country === 'World') {
                    worldCount++;
                }
            })
            expect(ukCount).to.be.equal(1);
            expect(worldCount).to.be.equal(1);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    // it('select with order by', function (done) {
    //     con.select({
    //         from: 'Customers',
    //         order: {
    //             by: 'country',
    //             type: "desc"
    //         }
    //     }).then(function (results) {
    //         expect(results).to.be.an('array').length(93);
    //         done();
    //     }).catch(function (err) {
    //         done(err);
    //     })
    // });

    it('select with order by,limit 5', function (done) {
        con.select({
            from: 'Customers',
            order: {
                by: 'country',
                type: "desc"
            },
            limit: 5,
            case: {
                country: [{
                    '!=': 'Venezuela',
                    then: 'U.S.A.'
                }, {
                    then: 'Venezuela'
                }]
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            var venezuelaCount = 0;
            var usaCount = 0;
            results.forEach(function (result) {
                if (result.country === 'Venezuela') {
                    venezuelaCount++;
                }
                else if (result.country === 'U.S.A.') {
                    usaCount++;
                }
            })
            expect(venezuelaCount).to.be.equal(4);
            expect(usaCount).to.be.equal(1);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with where & limit', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: 'Germany',
                city: {
                    like: '%n%'
                }
            },
            limit: 10,
            case: {
                city: [{
                    '=': "Berlin",
                    then: 'Berlin Germany'
                }, {
                    '=': "Aachen",
                    then: 'Aachen Germany'
                }, {
                    then: 'Others'
                }]
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(9);
            var berlinCount = 0;
            var aachenCount = 0;
            var otherCount = 0;
            results.forEach(function (result) {
                if (result.city === 'Berlin Germany') {
                    berlinCount++;
                }
                else if (result.city === 'Aachen Germany') {
                    aachenCount++;
                }
                else if (result.city === 'Others') {
                    otherCount++;
                }
            })
            expect(berlinCount).to.be.equal(1);
            expect(aachenCount).to.be.equal(1);
            expect(otherCount).to.be.equal(7);
            done();
        }).catch(done);
    });

    it('select with operator - >', function (done) {
        con.select({
            from: 'Products',
            case: {
                price: [{
                    ">": 20, then: "200"
                }, {
                    then: 2000
                }]
            }
        }).then(function (results) {
            // console.table(results);
            var twentyCount = 0;
            var otherCount = 0;
            results.forEach(function (result) {
                if (result.price === "200") {
                    twentyCount++;
                }
                else if (result.price === 2000) {
                    otherCount++;
                }
            })
            expect(twentyCount).to.be.equal(37);
            expect(otherCount).to.be.equal(40);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with operator - >=', function (done) {
        con.select({
            from: 'Products',
            case: {
                price: [{
                    ">=": 20, then: 200
                }, {
                    then: 2000
                }]
            }
        }).then(function (results) {
            // console.table(results);
            var twentyCount = 0;
            var otherCount = 0;
            results.forEach(function (result) {
                if (result.price === 200) {
                    twentyCount++;
                }
                else if (result.price === 2000) {
                    otherCount++;
                }
            })
            expect(twentyCount).to.be.equal(38);
            expect(otherCount).to.be.equal(39);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with operator - <=', function (done) {
        con.select({
            from: 'Products',
            case: {
                price: [{
                    "<=": 20, then: 200
                }, {
                    then: 2000
                }]
            }
        }).then(function (results) {
            // console.table(results);
            var twentyCount = 0;
            var otherCount = 0;
            results.forEach(function (result) {
                if (result.price === 200) {
                    twentyCount++;
                }
                else if (result.price === 2000) {
                    otherCount++;
                }
            })
            expect(twentyCount).to.be.equal(40);
            expect(otherCount).to.be.equal(37);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with operator - <', function (done) {
        con.select({
            from: 'Products',
            case: {
                price: [{
                    "<": 20, then: 200
                }, {
                    then: 2000
                }]
            }
        }).then(function (results) {
            // console.table(results);
            var twentyCount = 0;
            var otherCount = 0;
            results.forEach(function (result) {
                if (result.price === 200) {
                    twentyCount++;
                }
                else if (result.price === 2000) {
                    otherCount++;
                }
            })
            expect(twentyCount).to.be.equal(39);
            expect(otherCount).to.be.equal(38);
            done();
        }).catch(function (err) {
            done(err);
        })
    });
});