describe('Test transaction', function () {
    it('inner join', function (done) {
        var transaction_query = {
            TableNames: ['Customers'],
            Data: {
                InsertValues: [{
                    CustomerName: 'ujjwalfev gupta',
                    ContactName: 'ujjwadcvl',
                    Address: 'bhubaneswdfar odisha',
                    City: 'bhubaneswar',
                    PostalCode: '12345',
                    Country: 'BangKok'
                }]
            },
            Logic: function (data) {
                insert({
                    into: 'Customers',
                    values: data.InsertValues
                });
                select({
                    from: 'Customers',
                    OnSuccess: function (results) {
                        this._results = results;
                    }
                })
            }
        }
        Con.transaction(transaction_query, function (results) {
            console.log(results);
        });
    })
})