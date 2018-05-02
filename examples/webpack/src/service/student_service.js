import {
    BaseService
} from "./base_service";

export class StudentService extends BaseService {

    constructor() {
        super();
        this.tableName = "students";
    }

    getStudents() {
        return this.connection.select({
            from: this.tableName,
        })
    }

    addStudent(student) {
        return this.connection.insert({
            into: this.tableName,
            values: [student],
            return: true
        })
    }

    getStudentById(id) {
        return this.connection.select({
            from: this.tableName,
            where: {
                id: id
            }
        })
    }

    removeStudent(id) {
        return this.connection.remove({
            from: this.tableName,
            where: {
                id: id
            }
        })
    }

    updateStudentById(id, updateData) {
        return this.connection.update({ in: this.tableName,
            set: updateData,
            where: {
                id: id
            }
        })
    }
}