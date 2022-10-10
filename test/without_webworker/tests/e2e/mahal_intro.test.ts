describe("Student", () => {

    it("get data", async () => {
        const results = await window['studentComp'].getStudentsFromIndexedDb();
        expect(results).length(0);
    });
});