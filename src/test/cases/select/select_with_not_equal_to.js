describe('Test Select with not equal to', function () {

    it("select * from employees where jobSuspendedFlag!=0)", function (done) {
        Con.select({
            from: 'Employees',
            where: {
                jobSuspendedFlag: {
                    '!=': 0
                }
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

    it("select * from employees where jobSuspendedFlag!=1)", function (done) {
        Con.select({
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
        Con.select({
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
        Con.select({
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

});