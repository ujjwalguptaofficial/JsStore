describe('Test Select with order', function () {
    it('order by country & city', function (done) {
        con.select({
            from: 'Customers',
            order: [{
                by: 'Country'
            }, {
                by: 'City'
            }]
        }).then(function (results) {
            var countries = ["Argentina", "Argentina", "Argentina", "Austria", "Austria",
                "Belgium", "Belgium", "Brazil", "Brazil", "Brazil"];
            var cities = ["Buenos Aires", "Buenos Aires", "Buenos Aires", "Graz", "Salzburg",
                "Bruxelles", "Charleroi", "Campinas", "Resende", "Rio de Janeiro"];
            for (var i = 0; i < 10; i++) {
                const result = results[i];
                expect(result.Country).to.be.equal(countries[i]);
                expect(result.City).to.be.equal(cities[i]);
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
                by: 'Country'
            }, {
                by: 'City'
            }]
        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            var countries = ["Argentina", "Argentina", "Argentina", "Austria", "Austria",
                "Belgium", "Belgium", "Brazil", "Brazil", "Brazil"];
            var cities = ["Buenos Aires", "Buenos Aires", "Buenos Aires", "Graz", "Salzburg",
                "Bruxelles", "Charleroi", "Campinas", "Resende", "Rio de Janeiro"];
            for (var i = 0; i < 10; i++) {
                const result = results[i];
                expect(result.Country).to.be.equal(countries[i]);
                expect(result.City).to.be.equal(cities[i]);
            }
            done();
        }).catch(function (err) {
            done(err);
        })
    })
});