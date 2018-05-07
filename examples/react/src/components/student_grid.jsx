import React from "react";
import { Student } from "../model/student";

export default class StudentGrid extends React.Component {
    editStudentId;
    constructor() {
        super();
        this.state = {
            isEditing: false
        };
        this.editStudentId = 0;
        this.newStudent = new Student();
    }

    clearAddRowTextvalue() {
        var addRow = document.querySelector('#divStudent thead').rows[1];
        addRow.cells[0].querySelector('input[type="text"]').value = "";
        addRow.cells[1].querySelector('input[type="text"]').value = "";
        addRow.cells[2].querySelector('input[type="text"]').value = "";
        addRow.cells[3].querySelector('input[type="text"]').value = "";

    }

    addStudent() {
        const addRow = document.querySelector('#divStudent thead').rows[1];
        const student = new Student();
        student.name = addRow.cells[0].querySelector('input[type="text"]').value;
        student.gender = addRow.cells[1].querySelector('input[type="text"]').value;
        student.country = addRow.cells[2].querySelector('input[type="text"]').value;
        student.city = addRow.cells[3].querySelector('input[type="text"]').value;
        this.props.addHandler(student);
    }

    editStudent(e) {
        this.editStudentId = Number(e.target.parentElement.parentElement.getAttribute('data-id'));
        if (this.state.isEditing === true) {
            this.setState({ isEditing: false });
        }
        else {
            this.setState({ isEditing: true });
        }
    }

    getStudentById(id) {
        var student;
        this.props.students.every((value) => {
            if (value.id === id) {
                student = value;
                return false;
            }
            return true;
        })
        return student;
    }

    updateStudent(e) {
        var studentEditTable = document.querySelector('#divEditStudent table');
        var student = new Student(
            this.editStudentId,
            studentEditTable.rows[0].cells[1].querySelector('input').value,
            studentEditTable.rows[1].cells[1].querySelector('input').value,
            studentEditTable.rows[2].cells[1].querySelector('input').value,
            studentEditTable.rows[3].cells[1].querySelector('input').value,
        );
        this.props.updateHandler(student);
    }

    onStudentUpdated() {
        this.setState({ isEditing: false });
    }

    deleteStudent(e) {
        var row = e.target.parentElement.parentElement;
        const studentId = Number(row.getAttribute('data-id'));
        this.props.deleteHandler(studentId);
    }

    getGridHtml() {
        const gridTbodyHtml = this.props.students.map((student) => {
            return (
                <tr data-id={student.id}>
                    <td>{student.name}</td>
                    <td>{student.gender}</td>
                    <td>{student.country}</td>
                    <td>{student.city}</td>
                    <td>
                        <button onClick={this.editStudent.bind(this)}>
                            {this.state.isEditing ? "Update" : "Edit"}
                        </button>
                    </td>
                    <td>
                        <button onClick={this.deleteStudent.bind(this)}>
                            Delete
                        </button>
                    </td>
                </tr>
            )
        });
        const gridHtml = <table id="divStudent" style={{ 'margin': '0 auto' }}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Country</th>
                    <th>City</th>
                    <th></th>
                    <th></th>
                </tr>
                <tr>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td>
                        <button onClick={this.addStudent.bind(this)}>Add</button>
                    </td>
                    <td>
                        <button onClick={this.clearAddRowTextvalue}>Cancel</button>
                    </td>
                </tr>
            </thead>
            <tbody>
                {gridTbodyHtml}
            </tbody>
        </table>;
        return gridHtml;
    }

    getEditStudentHtml() {
        const student = this.getStudentById(this.editStudentId);
        return (
            <div id="divEditStudent">
                <table style={{ margin: '0 auto' }}>
                    <tr>
                        <td>Name :</td>
                        <td><input type="text" defaultValue={student.name} /></td>
                    </tr>
                    <tr>
                        <td>Gender :</td>
                        <td><input type="text" defaultValue={student.gender} /></td>
                    </tr>
                    <tr>
                        <td>Country :</td>
                        <td><input type="text" defaultValue={student.country} /></td>
                    </tr>
                    <tr>
                        <td>City :</td>
                        <td><input type="text" defaultValue={student.city} /></td>
                    </tr>
                    <tr>
                        <td colSpan="2" style={{ 'text-align': 'center', 'padding-top': '25px' }}>
                            <button onClick={this.updateStudent.bind(this)}>Update</button>
                            <button style={{ 'margin-left': '10px' }} onclick={this.onStudentUpdated.bind(this)}>Cancel</button>
                        </td>
                    </tr>
                </table>
            </div>
        )
    }

    render() {
        return (
            this.state.isEditing ? this.getEditStudentHtml() : this.getGridHtml()
        );
    }
}