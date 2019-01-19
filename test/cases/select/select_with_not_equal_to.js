describe('Test Select with not equal to', function () {

    it("select * from employees where jobSuspendedFlag!=0 and lastName like '%e%')", function (done) {
        con.select({
            from: 'Employees',
            where: {
                jobSuspendedFlag: {
                    '!=': 0
                },
                lastName: {
                    like: '%e%',
                },
            }
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(3);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it("select * from employees where jobSuspendedFlag!=1)", function (done) {
        con.select({
            from: 'Employees',
            where: {
                jobSuspendedFlag: {
                    '!=': 1
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(27);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it("select * from employees where jobSuspendedFlag!=0 && state in('Working', 'Diagnostics', 'FinalTest')", function (done) {
        con.select({
            from: 'Employees',
            where: {
                jobSuspendedFlag: {
                    '!=': 0
                },
                state: { in: ['Working', 'Diagnostics', 'FinalTest'],
                },
            }
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(7);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it("select * from employees where jobSuspendedFlag!=1 && state in('Working', 'Diagnostics', 'FinalTest')", function (done) {
        con.select({
            from: 'Employees',
            where: {
                jobSuspendedFlag: {
                    '!=': 1
                },
                state: { in: ['Working', 'Diagnostics', 'FinalTest']
                }
            }
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(15);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

    it("select * from employees where (notes like '%from%' && state!='Concluded') && state !='WaitPickup'", function (done) {
        con.select({
            from: 'Employees',
            where: [{
                notes: {
                    'like': '%from%'
                },
                state: {
                    '!=': 'Concluded'
                }
            }, {
                state: {
                    '!=': 'WaitPickup'
                }
            }]
        }).
        then(function (results) {
            expect(results).to.be.an('array').length(6);
            done();
        }).
        catch(function (err) {
            done(err);
        })
    });

});