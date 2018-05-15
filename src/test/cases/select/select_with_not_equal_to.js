describe('Test Select with not equal to', function () {
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
            expect(results).to.be.an('array').length(0);
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
                state: { in: ['Working', 'Diagnostics', 'FinalTest']
                }
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

    it("select * from employees where jobSuspendedFlag=0 && state in('Working', 'Diagnostics', 'FinalTest')", function (done) {
        Con.select({
            from: 'Employees',
            where: {
                jobSuspendedFlag: 0,
                state: { in: ['Working', 'Diagnostics', 'FinalTest']
                }
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
});