describe('Test bulkInsert', function () {
    it('insert OrderDetails - using bulk insert', function (done) {
        $.getJSON("static/OrderDetails.json", function (results) {
            Con.bulkInsert({
                Into: 'OrderDetails',
                Values: results,
                OnSuccess: function (results) {
                    expect(results).to.be.an('undefined');
                    done();
                },
                OnError: function (err) {
                    done(err);
                }
            });
        });
    });

    it('wrong table test', function (done) {
        Con.bulkInsert({
            Into: 'Custamer'
        }).
        catch(function (err) {
            console.log(err);
            var error = {
                _type: "not_array",
                _message: "Supplied value is not an array"
            };
            expect(err).to.be.an('object').eql(error);
            done();
        })
    });
});