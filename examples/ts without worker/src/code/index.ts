import "../styles/app.css";
import { StudentLogic } from './business/student_logic';
const studentLogic = new StudentLogic();
studentLogic.refreshStudentList();