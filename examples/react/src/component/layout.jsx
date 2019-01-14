import React from "react";
import StudentGrid from "./student_grid";
import { StudentService } from "../service/student_service";

export default class Layout extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <StudentGrid />
            </div>
        )
    }
}