describe('group by & case', function () {

    it(`SELECT * FROM employee_db group by 
    CASE WHEN Salary >=80000 AND Salary <=100000 THEN Director 
    WHEN Salary >=50000 AND Salary <80000 THEN Senior Consultant 
    Else Director`, function (done) {
        con.initDb(getEmployeeDbSchema());
        con.select({
            from: 'employee',
            groupBy: {
                'salary': [
                    {
                        '>=': 80000,
                        then: 'Director'
                    },
                    {
                        '<': 50000,
                        then: 'Senior Consultant'
                    },
                    {
                        then: 'Junior'
                    }
                ]
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(3);
            // var prices = [25, 30, 40, 97, 10, 31, 21, 38, 6, 23.25];
            // results.forEach(function (result, i) {
            //     expect(result.price).to.be.equal(prices[i]);
            // });
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it(`groupby + case + aggregate `, function (done) {
        con.select({
            from: 'employee',
            case: {
                'salary': [
                    {
                        '-': { low: 80000, high: 10000 },
                        then: 'Director'
                    },
                    {
                        '-': { low: 50000, high: 80000 },
                        then: 'Senior Consultant'
                    },
                    {
                        then: 'Director'
                    }
                ]
            },
            aggregate: {
                min: 'salary',
                max: 'salary'
            },
            groupBy: {
                'salary': [
                    {
                        '-': { low: 80000, high: 10000 },
                        then: 'Director'
                    },
                    {
                        '-': { low: 50000, high: 80000 },
                        then: 'Senior Consultant'
                    },
                    {
                        then: 'Director'
                    }
                ]
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            expect(results[0]['min(salary)']).to.be.equal('Director');
            expect(results[0]['max(salary)']).to.be.equal('Senior Consultant');
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('init demo db again', function (done) {
        con.initDb(getDemoDbSchema()).then(function () {
            done();
        })
    });

    it('groupby limit', function (done) {
        con.select({
            from: "Customers",
            groupBy: "country",

            limit: 10
        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            done();
        }).catch(done)
    });

    it('groupby skip', function (done) {
        con.select({
            from: "Customers",
            groupBy: "country",
            skip: 10
        }).then(function (results) {
            expect(results).to.be.an('array').length(12);
            done();
        }).catch(done)
    });

    it('groupby skip & limit', function (done) {
        con.select({
            from: "Customers",
            groupBy: "country",
            skip: 10,
            limit: 8
        }).then(function (results) {
            expect(results).to.be.an('array').length(8);
            expect(results[0].customerId).to.equal(59);
            done();
        }).catch(done)
    });

});