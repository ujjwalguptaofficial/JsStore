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

    it('select with order by,limit 10', function (done) {
        con.select({
            from: 'Customers',
            order: {
                by: 'country',
                type: "asc"
            },
            limit: 10,
            case: {
                country: [{
                    '=': 'Brazil',
                    then: 'U.S.A.'
                }, {
                    then: null
                }]
            }

        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            var countries = [
                "Argentina", "Argentina", "Argentina", "Austria", "Austria",
                "Belgium", "Belgium", 'U.S.A.', 'U.S.A.', 'U.S.A.'
            ]
            results.forEach(function (result, i) {
                expect(result.country).to.be.equal(countries[i]);
            });
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

    it('join', function (done) {
        con.select({
            from: "Orders",
            case: {
                employeeId: [
                    {
                        '>': 8,
                        then: 'I am 8'
                    },
                    {
                        then: 'others'
                    }
                ]
            },
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            var eightCount = 0;
            var otherCount = 0;
            results.forEach(function (result) {
                if (result.employeeId === 'I am 8') {
                    eightCount++;
                }
                else if (result.employeeId === 'others') {
                    otherCount++;
                }
            })
            expect(eightCount).to.be.equal(6);
            expect(otherCount).to.be.equal(190);
            done();
        }).catch(function (err) {
            done(err);
        })
    })

    it('join with order', function (done) {
        con.select({
            from: "Orders",
            case: {
                employeeId: [
                    {
                        '>': 8,
                        then: 'I am 8'
                    },
                    {
                        then: 'others'
                    }
                ]
            },
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(196);
            var eightCount = 0;
            var otherCount = 0;
            results.forEach(function (result) {
                if (result.employeeId === 'I am 8') {
                    eightCount++;
                }
                else if (result.employeeId === 'others') {
                    otherCount++;
                }
            })
            expect(eightCount).to.be.equal(6);
            expect(otherCount).to.be.equal(190);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('create employee db table', function (done) {
        con.initDb(getEmployeeDbSchema());
        con.insert({
            into: 'employee',
            values: getEmployeeDbValues()
        }).then(function (result) {
            done();
        }).catch(done);
    })

    it('update employee db - test for null update', function (done) {
        con.update({
            in: 'employee',
            set: {
                "temp": null
            },
            where: {
                employeeId: 1
            }
        }).then(function (result) {
            expect(result).to.be.an('number').equal(1);
            done();
        }).catch(done);
    })

    it('select from employee & check isManager', function (done) {
        con.select({
            from: 'employee',
        }).then(function (results) {
            expect(results[0].isManager).to.be.an("boolean").equal(false)
            done();
        }).catch(done);
    })

    it(`Select EmployeeName,Gender,Salary from Employee
    ORDER BY CASE Gender WHEN 'F' THEN Salary else 'salary' End DESC,
    Case WHEN Gender = 'M' THEN Salary  END`, function (done) {
        con.select({
            from: 'employee',
            order: {
                by: {
                    'gender': [{
                        '=': 'F',
                        then: 'salary',
                    }, {
                        then: 'salary'
                    }]
                },
                type: 'desc'
            }

        }).then(function (results) {
            const salaries = [95000, 93000, 88000, 83000, 76000, 75000, 75000, 71000, 64000, 42000];
            results.forEach(function (result, i) {
                expect(result.salary).to.be.equal(salaries[i]);
            })
            done();
        }).catch(done);
    });

    it(`Select EmployeeName,Gender,Salary from Employee
    ORDER BY CASE Gender WHEN 'F' THEN Salary else 'salary' End DESC,
    Case WHEN Gender = 'M' THEN Salary  END`, function (done) {
        con.select({
            from: 'employee',
            order: {
                by: {
                    'gender': [{
                        '=': 'F',
                        then: 'salary',
                    }, {
                        then: 'salary'
                    }]
                },
                // type: 'asc'
            }

        }).then(function (results) {
            const salaries = [42000, 64000, 71000, 75000, 75000, 76000, 83000, 88000, 93000, 95000];
            results.forEach(function (result, i) {
                expect(result.salary).to.be.equal(salaries[i]);
            })
            done();
        }).catch(done);
    });


    // it(`Select EmployeeName,Gender,Salary from Employee
    // ORDER BY CASE Gender WHEN 'F' THEN Salary else 'salary' End DESC,
    // Case WHEN Gender = 'M' THEN Salary  END`, function (done) {
    //     con.select({
    //         from: 'employee',
    //         order: {
    //             by: {
    //                 'gender': [{
    //                     '=': 'F',
    //                     then: 'salary',
    //                 }, {
    //                     then: 'gender'
    //                 }]
    //             },
    //             type: 'desc'
    //         }

    //     }).then(function (results) {
    //         const salaries = [95000, 93000, 88000, 83000, 76000, 75000, 75000, 71000, 64000, 42000];
    //         results.forEach(function (result, i) {
    //             expect(result.salary).to.be.equal(salaries[i]);
    //         })
    //         done();
    //     }).catch(done);
    // });

    it('M -> Male & F -> Female', function (done) {
        con.select({
            from: 'employee',
            case: {
                gender: [{
                    '=': 'M',
                    then: 'Male'
                }, {
                    then: 'Female'
                }]
            }
        }).then(function (results) {
            const genders = ["M", "M", "F", "M", "M", "F", "F", "F", "M", "M"]
            results.forEach(function (result, i) {
                if (genders[i] === "M") {
                    expect(result.gender).to.be.equal("Male");
                }
                else {
                    expect(result.gender).to.be.equal("Female");
                }
            })
            done();
        }).catch(done);
    });

    // it('drop db', function (done) {
    //     con.dropDb().then(function (result) {
    //         done();
    //     });
    // });

    it('init demo db again', function (done) {
        con.initDb(getDemoDbSchema()).then(function () {
            done();
        })
    });
});