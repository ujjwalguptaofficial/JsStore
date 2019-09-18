describe('Test Select with order', function () {
    it('order by country & city', function (done) {
        con.select({
            from: 'Customers',
            order: [{
                by: 'country'
            }, {
                by: 'city'
            }]
        }).then(function (results) {
            var countries = ["Argentina", "Argentina", "Argentina", "Austria", "Austria",
                "Belgium", "Belgium", "Brazil", "Brazil", "Brazil"];
            var cities = ["Buenos Aires", "Buenos Aires", "Buenos Aires", "Graz", "Salzburg",
                "Bruxelles", "Charleroi", "Campinas", "Resende", "Rio de Janeiro"];
            for (var i = 0; i < 10; i++) {
                var result = results[i];
                expect(result.country).to.be.equal(countries[i]);
                expect(result.city).to.be.equal(cities[i]);
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    })

    it('order by country & city with limit', function (done) {
        con.select({
            from: 'Customers',
            limit: 10,
            order: [{
                by: 'country'
            }, {
                by: 'city'
            }]
        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            var countries = ["Argentina", "Argentina", "Argentina", "Austria", "Austria",
                "Belgium", "Belgium", "Brazil", "Brazil", "Brazil"];
            var cities = ["Buenos Aires", "Buenos Aires", "Buenos Aires", "Graz", "Salzburg",
                "Bruxelles", "Charleroi", "Campinas", "Resende", "Rio de Janeiro"];
            for (var i = 0; i < 10; i++) {
                var result = results[i];
                expect(result.country).to.be.equal(countries[i]);
                expect(result.city).to.be.equal(cities[i]);
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    })

    it('order by country from both method', function (done) {
        con.select({
            from: 'Customers',
            order: {
                by: 'country',
                type: 'desc',
                idbSorting: false
            }
        }).then(function (results1) {
            con.select({
                from: 'Customers',
                order: [{
                    by: 'country',
                    type: 'desc'
                }]
            }).then(function (results2) {
                expect(results1).to.be.an('array').deep.equal(results2);
                done();
                done();
            }).catch(done);
        }).catch(function (err) {
            done(err);
        })
    })
});