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
            console.log('results');
            console.table(results);
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

    it('select with order by', function (done) {
        con.select({
            from: 'Customers',
            order: {
                by: 'country',
                type: "desc"
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(93);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with order by,limit 5, deep eql', function (done) {
        con.select({
            from: 'Customers',
            order: {
                by: 'country',
                type: "desc"
            },
            limit: 5
        }).
            then(function (results) {
                var datas = [{
                    "customerId": 47,
                    "customerName": "LINO-Delicateses",
                    "contactName": "Felipe Izquierdo",
                    "address": "Ave. 5 de Mayo Porlamar",
                    "city": "I. de Margarita",
                    "postalCode": "4980",
                    "country": "Venezuela"
                }, {
                    "customerId": 46,
                    "customerName": "LILA-Supermercado",
                    "contactName": "Carlos González",
                    "address": "Carrera 52 con Ave. Bolívar #65-98 Llano Largo",
                    "city": "Barquisimeto",
                    "postalCode": "3508",
                    "country": "Venezuela"
                }, {
                    "customerId": 35,
                    "customerName": "HILARIÓN-Abastos",
                    "contactName": "Carlos Hernández",
                    "address": "Carrera 22 con Ave. Carlos Soublette #8-35",
                    "city": "San Cristóbal",
                    "postalCode": "5022",
                    "country": "Venezuela"
                }, {
                    "customerId": 33,
                    "customerName": "GROSELLA-Restaurante",
                    "contactName": "Manuel Pereira",
                    "address": "5ª Ave. Los Palos Grandes",
                    "city": "Caracas",
                    "postalCode": "1081",
                    "country": "Venezuela"
                }, {
                    "customerId": 89,
                    "customerName": "White Clover Markets",
                    "contactName": "Karl Jablonski",
                    "address": "305 - 14th Ave. S. Suite 3B",
                    "city": "Seattle",
                    "postalCode": "98128",
                    "country": "USA"
                }];
                expect(results).to.be.an('array').length(5).deep.equal(datas);
                done();
            }).
            catch(function (err) {
                done(err);
            })
    });

    it('select * from suppliers where postalCode like - "43951%"', function (done) {
        con.select({
            from: 'Suppliers',
            where: {
                postalCode: {
                    like: '43951%'
                }
            }
        }).
            then(function (results) {
                if (results.length > 0) {
                    expect(results).to.be.an('array').length(3);
                    done();
                } else {
                    done('no results');
                }
            }).
            catch(function (err) {
                done(err);
            });
    });

    it('select with where & key null', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: null
            }
        }).
            catch(function (err) {
                var error = {
                    "message": "Null/undefined is not allowed in where. Column 'country' has null",
                    "type": "null_value_in_where"
                };
                expect(err).to.be.an('object').eql(error);
                done();
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
            limit: 10
        }).then(function (results) {
            expect(results).to.be.an('array').length(9);
            done();
        }).catch(done);
    });
});