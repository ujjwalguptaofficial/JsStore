import { initiate, mount, getMount } from "@mahaljs/test-utils";
import Student from "@/components/student.mahal";

describe("Student", () => {
    let component: Student;
    before(async () => {
        component = await mount(Student);
    });

    it("get data", async () => {
        const results = await window['studentComp'].getStudentsFromIndexedDb();
        expect(results).length(0);
    });
});