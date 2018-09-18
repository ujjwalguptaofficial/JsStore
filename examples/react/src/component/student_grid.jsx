import React from "react";

export default class StudentGrid extends React.Component {


    constructor() {
        super();
        this.state = {
            isEditing: false,
            editStudentId: 0
        }
    }

    add() {
        var student = {
            name: this.refs.name.value,
            gender: this.refs.gender.value,
            country: this.refs.country.value,
            city: this.refs.city.value
        }
        this.props.addHandler(student);
        this.clear();
    }

    clear() {
        this.refs.name.value = "";
        this.refs.gender.value = "";
        this.refs.country.value = "";
        this.refs.city.value = "";
    }

    editUpdate(el) {
        const row = el.target.parentElement.parentElement;
        const studentId = Number(row.dataset.id);
        if (this.state.isEditing) {
            const student = {
                id: studentId,
                name: row.children[0].firstChild.value,
                gender: row.children[1].firstChild.value,
                country: row.children[2].firstChild.value,
                city: row.children[3].firstChild.value
            }
            this.props.updateHandler(student);
        }
        else {
            this.setState({ isEditing: true, editStudentId: studentId });
        }
    }

    delete(el) {
        const row = el.target.parentElement.parentElement;
        const studentId = Number(row.dataset.id);
        this.props.deleteHandler(studentId);
    }

    onStudentUpdated() {
        this.setState({ isEditing: false, editStudentId: 0 });
    }

    onStudentDeleted() {
        alert("Row Deleted");
    }

    render() {
        const getCell = (value) => {
            return this.state.isEditing ?
                <input type="text" defaultValue={value} /> :
                { value }
        }

        const dataRows = this.props.students.map(student => {
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