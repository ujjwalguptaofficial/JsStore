<template>
  <table>
    <tr>
      <th>Name</th>
      <th>Gender</th>
      <th>Country</th>
      <th>City</th>
    </tr>
    <tr>
      <td>
        <input type="text" v-model="newStudent.name">
      </td>
      <td>
        <input type="text" v-model="newStudent.gender">
      </td>
      <td>
        <input type="text" v-model="newStudent.country">
      </td>
      <td>
        <input type="text" v-model="newStudent.city">
      </td>
      <td>
        <button @click="add">Add</button>
      </td>
      <td>
        <button @click="clear">Clear</button>
      </td>
    </tr>
    <tr v-for="student in students" :key="student.id">
      <template v-if="editStudent!=null && editStudent.id==student.id">
        <td>
          <input type="text" v-model="editStudent.name">
        </td>
        <td>
          <input type="text" v-model="editStudent.gender">
        </td>
        <td>
          <input type="text" v-model="editStudent.country">
        </td>
        <td>
          <input type="text" v-model="editStudent.city">
        </td>
        <td>
          <button @click="update(editStudent.id)">Update</button>
        </td>
        <td>
          <button @click="cancelUpdate">Cancel</button>
        </td>
      </template>
      <template v-else>
        <td>{{student.name}}</td>
        <td>{{student.gender}}</td>
        <td>{{student.country}}</td>
        <td>{{student.city}}</td>
        <td>
          <button @click="edit(student.id)">Edit</button>
        </td>
        <td>
          <button @click="remove(student.id)">Delete</button>
        </td>
      </template>
      
    </tr>
  </table>
</template>
<script>
import { StudentService } from "../service/student_service";
export default {
  name: "Student",
  data: function() {
    return {
      students: [],
      newStudent: null,
      editStudent: null
    };
  },
  beforeMount: function() {
    this.clear();
  },
  mounted: function() {
    this.refreshStudent();
  },
  methods: {
    refreshStudent: async function() {
      this.students = await new StudentService().getStudents();
    },
    add: async function() {
      try {
        const studentsAdded = await new StudentService().addStudent(
          this.newStudent
        );
        this.students.push(studentsAdded[0]);
        this.clear();
      } catch (ex) {
        // handle exception
      }
    },
    clear: function() {
      this.newStudent = {
        name: "",
        gender: "",
        country: "",
        city: ""
      };
    },
    edit: function(id) {
      var student = this.students.find(qry => qry.id === id);
      this.editStudent = {
        id: student.id,
        name: student.name,
        gender: student.gender,
        country: student.country,
        city: student.city
      };
    },
    remove: async function(id) {
      const service = new StudentService();
      const noOfStudentRemoved = await service.removeStudent(id);
      this.refreshStudent();
    },
    update: async function(id) {
      const service = new StudentService();
      await service.updateStudentById(id, {
        name: this.editStudent.name,
        gender: this.editStudent.gender,
        country: this.editStudent.country,
        city: this.editStudent.city
      });
      this.editStudent = null;
      this.refreshStudent();
    },
    cancelUpdate: function() {
      this.editStudent = null;
    }
  }
};
</script>

