import React from "react";
import StudentGrid from "./student_grid";
import { StudentService } from "../service/student_service";

export default class Layout extends React.Component {
    constructor() {
        super();
        this.service = new StudentService();
        this.state = {
            students: []
        };
    }

    componentDidMount() {
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
        this.service.addStudent(student).then((students) => {
            this.state.students.push(student);
            this.setState({ students: this.state.students });
        }).catch((err) => {
            console.log(err);
        });
    }

    updateStudent(student) {
        const index = this.state.students.findIndex(value => value.id === student.id);
        if (index >= 0) {
            const setValue = {
                name: student.name,
                gender: student.gender,
                country: student.country,
                city: student.city
            };
            this.service.updateStudentById(student.id, setValue).then((rowsUpdated) => {
                if (rowsUpdated > 0) {
                    this.state.students[index] = student;
                    this.setState({ student: this.state.students });
                    this.refs.studentGrid.onStudentUpdated();
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    deleteStudent(studentId) {
        const index = this.state.students.findIndex(value => value.id === studentId);
        if (index >= 0) {
            this.service.removeStudent(studentId).then((rowsDeleted) => {
                if (rowsDeleted > 0) {
                    this.state.students.splice(index, 1);
                    this.setState({ student: this.state.students });
                    this.refs.studentGrid.onStudentDeleted();
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    render() {
        return (
            <div>
                <StudentGrid ref="studentGrid" students={this.state.students}
                    addHandler={this.addStudent.bind(this)}
                    updateHandler={this.updateStudent.bind(this)}
                    deleteHandler={this.deleteStudent.bind(this)}
                />
            </div>
        )
    }
}