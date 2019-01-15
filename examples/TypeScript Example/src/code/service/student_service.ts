import { BaseService } from './base_service';
import { Student } from '../model/student';

export class StudentService extends BaseService {
    
    getStudents() {
        return this.connection.select<Student>({
            from: 'students'
        });
    }

    addStudent(student: Student) {
        return this.connection.insert({
            into: 'students',
            values: [student]
        });
    }

    deleteStudent(studentId: number) {
        return this.connection.remove({
            from: 'students',
            where: {
                id: studentId
            }
        });
    }

    getStudent(studentId: number) {
        return this.connection.select<Student>({
            from: 'students',
            where: {
                id: studentId
            }
        });
    }

    updateStudent(studentId: number, value) {
        return this.connection.update({
            in: 'students',
            set: value,
            where: {
                id: studentId
            }
        });
    }
}