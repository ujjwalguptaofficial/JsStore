describe("Regex", function () {
    it('select with regex on single column', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: {
                    regex: /mexico|brazil/i
                }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(5 + 9);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with regex on two column', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: { regex: /mexico|brazil/i },
                city: { regex: /.ampinas/ }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with regex on single column & limit', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: {
                    regex: /mexico|brazil/i
                }
            },
            limit: 5
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with regex on single column & skip', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: {
                    regex: /mexico|brazil/i
                }
            },
            skip: 5
        }).then(function (results) {
            expect(results).to.be.an('array').length(9);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('select with regex on single column & skip,limit', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: {
                    regex: /mexico|brazil/i
                }
            },
            skip: 5,
            limit: 5
        }).then(function (results) {
            expect(results).to.be.an('array').length(5);
            done();
        }).catch(function (err) {
            done(err);
        })
    });


    it('select with mutliple regex and other fields', function (done) {
        con.select({
            from: 'Customers',
            where: {
                country: { regex: /mexico|brazil/i },
                city: { regex: /.ampinas|.*Paulo/ },
                contactName: { like: "Lúcia%" }
            }
        }).then(function (results) {
            expect(results).to.be.an('array').length(1);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

})