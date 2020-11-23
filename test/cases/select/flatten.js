const getBoutiqueDatabase = () => {
    const boutiqueModel = {
        name: "Boutique",
        columns: {
            id: {
                primaryKey: true
            },
            title: {
                dataType: JsStore.DATA_TYPE.String
            },
            types: {
                dataType: JsStore.DATA_TYPE.Array,
                multiEntry: true
            }
        }
    };

    const boutiqueTypeModel = {
        name: "BoutiqueType",
        columns: {
            id: {
                primaryKey: true
            },
            title: {
                dataType: JsStore.DATA_TYPE.String
            }
        }
    };

    const dataBase = {
        name: "BoutiqueDb",
        tables: [boutiqueModel, boutiqueTypeModel]
    };
    return dataBase;
};

describe("Flat", function () {
    it("create Boutique db", function (done) {
        con.initDb(getBoutiqueDatabase()).then(function (isDbCreated) {
            expect(isDbCreated).to.equal(true);
            done();
        }).catch(done);
    });

    it("insert boutique data", function (done) {
        const boutiques = [
            { id: "uniqueid04", title: "Sport 3000", types: ["uniqueid01"] },
            {
                id: "uniqueid05",
                title: "LuxuryWear",
                types: ["uniqueid02", "uniqueid03"]
            },
            { id: "uniqueid06", title: "WearShop", types: ["uniqueid03"] }
        ];
        con.insert({
            into: "Boutique",
            values: boutiques
        }).then(results => {
            expect(results).to.equal(3);
            done();
        }).catch(done);
    })

    it("insert boutique types data", function (done) {
        const boutiquesTypes = [
            { id: "uniqueid01", title: "Sport boutique" },
            { id: "uniqueid02", title: "Luxe boutique" },
            { id: "uniqueid03", title: "Wear boutique" }
        ];
        con.insert({
            into: "BoutiqueType",
            values: boutiquesTypes
        }).then(results => {
            expect(results).to.equal(3);
            done();
        }).catch(done);
    })

    it('select Boutique with flat', function (done) {
        con.select({
            from: 'Boutique',
            flatten: ["types"]
        }).then(function (results) {
            expect(results).to.be.an('array').length(4);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('drop db test', function (done) {
        con.dropDb().then(function () {
            done();
        }).catch(function (err) {
            done(err);
        });
    });

    it('open db Demo', function (done) {
        con.openDb("Demo").then(function (isDbCreated) {
            done();
        }).catch(function (err) {
            done(err);
        })
    });
})