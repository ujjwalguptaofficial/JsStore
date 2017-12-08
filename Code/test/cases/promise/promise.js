describe('Test promise', function () {

    it('count promise', function (done) {
        Con.count({
            From: 'Customers'
        }).then(function (results) {
            expect(results).to.be.an('number').to.equal(93);
            done();
        }).
        then(function (err) {
            done(err);
        })
    })

    it('select promise', function (done) {
        Con.select({
            From: 'Customers'
        }).then(function (results) {
            expect(results).to.be.an('array').length(93);
            done();
        }).
        then(function (err) {
            done(err);
        })
    })
});