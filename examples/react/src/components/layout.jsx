import React from "react";
import StudentGrid from './student_grid';
import { Student } from "../model/student";
import { StudentService } from "../service/student_service";
export default class Layout extends React.Component {

    constructor() {
        super();
        this.service = new StudentService();
        this.state = {
            students: []
        };
        this.loadStudentsFromDb();
    }

    loadStudentsFromDb() {
        this.service.getStudents().then((students) => {
            this.setState({ students: students })
        }).catch((err) => {
            console.log(err);
        });
    }

    addStudent(student) {
        this.service.addStudent(student).then((records) => {
            if (records.length > 0) {
                this.state.students.push(records[0]);
                this.setState({ student: this.state.students });
                this.refs.students_grid.clearAddRowTextvalue();
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    deleteStudent(id) {
        this.service.removeStudent(id).then((recordDeleted) => {
            if (recordDeleted > 0) {
                const index = this.state.students.findIndex(student => student.id === id);
                this.state.students.splice(index, 1);
                this.setState({ student: this.state.students });
            }

        }).catch((err) => {
            console.log(err);
        });
    }

    updateStudent(student) {
        const index = this.state.students.findIndex(value => value.id === student.id);
        const setValue = {
            name: student.name,
            gender: student.gender,
            country: student.country,
            city: student.city
        };
        const studentId = this.state.students[index].id;
        this.service.updateStudentById(studentId, setValue).then((recordUpdated) => {
            if (recordUpdated > 0) {
                this.state.students[index] = new Student(
                    studentId,
                    student.name,
                    student.gender,
                    student.country,
                    student.city
                );
                this.setState({ student: this.state.students });
                this.refs.students_grid.onStudentUpdated();
            }
        });
    }

    render() {
        return (
            <div>
                <StudentGrid ref="students_grid"
                    students={this.state.students}
                    addHandler={this.addStudent.bind(this)}
                    updateHandler={this.updateStudent.bind(this)}
                    deleteHandler={this.deleteStudent.bind(this)} />
            </div>
        )
    }
}