describe('Test join', function () {
    it('inner join', function (done) {
        DbCon.transaction(['Customers'], function () {
            select({
                From: 'Customers',
                OnSuccess: function (results) {
                    this._results = results;
                }
            })
        }, function (results) {
            console.log(results);
        });
    })
})