describe('Test bulkInsert', function () {
    it('insert OrderDetails - using bulk insert', function (done) {
        $.getJSON("test/static/OrderDetails.json", function (results) {
            Con.bulkInsert({
                into: 'OrderDetails',
                values: results,
            }).then(function (results) {
                expect(results).to.be.an('undefined');
                done();
            }).
            catch(function (err) {
                done(err);
            });
        });
    });

    it('wrong table test', function (done) {
        Con.bulkInsert({
            into: 'Custamer'
        }).
        catch(function (err) {
            console.log(err);
            var error = {
                type: "not_array",
                message: "Supplied value is not an array"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });
});