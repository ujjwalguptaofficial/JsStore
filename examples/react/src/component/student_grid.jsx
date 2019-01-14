import React from "react";
import { StudentService } from "../service/student_service";

export default class StudentGrid extends React.Component {


    constructor() {
        super();
        this.state = {
            isEditing: false,
            editStudentId: 0,
            students: []
        }
    }

    componentDidMount() {
        this.loadStudentsFromDb();
    }

    async loadStudentsFromDb() {
        const service = new StudentService();
        try {
            const students = await service.getStudents()
            this.setState({ students: students })
        }
        catch (ex) {
            console.error(ex);
        }
    }

    async add() {
        var student = {
            name: this.refs.name.value,
            gender: this.refs.gender.value,
            country: this.refs.country.value,
            city: this.refs.city.value
        }
        // add student into indexeddb
        const service = new StudentService();
        try {
            const students = await service.addStudent(student)
            this.state.students.push(students[0]);
            this.setState({ students: this.state.students });
            this.clear();
        }
        catch (ex) {
            console.error(ex);
        }

    }


    clear() {
        this.refs.name.value = "";
        this.refs.gender.value = "";
        this.refs.country.value = "";
        this.refs.city.value = "";
    }

    async  editUpdate(el) {
        const row = el.target.parentElement.parentElement;
        const studentId = Number(row.dataset.id);
        if (this.state.isEditing) {
            const updateValue = {
                name: row.children[0].firstChild.value,
                gender: row.children[1].firstChild.value,
                country: row.children[2].firstChild.value,
                city: row.children[3].firstChild.value
            }
            // update student into indexeddb
            const service = new StudentService();
            try {
                const rowsUpdated = await service.updateStudentById(studentId, updateValue);
                if (rowsUpdated > 0) {
                    const index = this.state.students.findIndex(value => value.id === studentId);
                    this.state.students[index] = { id: studentId, ...updateValue };
                    this.setState({ student: this.state.students, isEditing: false, editStudentId: 0 });
                }

            }
            catch (ex) {
                console.error(ex);
            }
        }
        else {
            this.setState({ isEditing: true, editStudentId: studentId });
        }
    }

    async delete(el) {
        const row = el.target.parentElement.parentElement;
        const studentId = Number(row.dataset.id);
        // delete student from indexeddb
        const service = new StudentService();
        try {
            const rowsDeleted = await service.removeStudent(studentId);
            if (rowsDeleted > 0) {
                const index = this.state.students.findIndex(value => value.id === studentId);
                this.state.students.splice(index, 1);
                this.setState({ student: this.state.students });
                alert("Row Deleted");
            }

        }
        catch (ex) {
            console.error(ex);
        }
    }


    render() {
        const getCell = (value) => {
            return this.state.isEditing ?
                <input type="text" defaultValue={value} /> :
                { value }
        }

        const dataRows = this.state.students.map(student => {
            if (student.id === this.state.editStudentId) {
                return (
                    <tr key={student.id} data-id={student.id}>
                        <td>
                            {getCell(student.name)}
                        </td>
                        <td>{getCell(student.gender)}</td>
                        <td>{getCell(student.country)}</td>
                        <td>{getCell(student.city)}</td>
                        <td>
                            <input type='button' value={this.state.isEditing ? 'update' : 'edit'}
                                onClick={this.editUpdate.bind(this)} />
                        </td>
                        <td>
                            <input type='button' value='delete'
                                onClick={this.delete.bind(this)} />
                        </td>
                    </tr>
                )
            }
            else {
                return (
                    <tr key={student.id} data-id={student.id}>
                        <td>{student.name}</td>
                        <td>{student.gender}</td>
                        <td>{student.country}</td>
                        <td>{student.city}</td>
                        <td><input type='button' value='edit' onClick={this.editUpdate.bind(this)} /></td>
                        <td>
                            <input type='button' value='delete'
                                onClick={this.delete.bind(this)} />
                        </td>
                    </tr>
                )
            }
        });
        const addRow = <tr key='0'>
            <td><input type="text" ref="name" /></td>
            <td><input type="text" ref="gender" /></td>
            <td><input type="text" ref="country" /></td>
            <td><input type="text" ref="city" /></td>
            <td>
                <input type='button' value='add' onClick={this.add.bind(this)} />
            </td>
            <td>
                <input type='button' value='cancel' onClick={this.clear.bind(this)} />
            </td>
        </tr>
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Country</th>
                            <th>City</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {addRow}
                        {dataRows}
                    </tbody>
                </table>
            </div>
        )
    }
}