<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Student/>
  </div>
</template>

<script>
import Student from "./components/Student.vue";
import { initJsStore } from "./service/idb_service";
import { StudentService } from "./service/student_service";
import { Global } from "./global";
export default {
  name: "app",
  components: {
    Student
  },
  beforeCreate: async function() {
    console.log("before create called");
    try {
      const isDbCreated = await initJsStore();
      if (isDbCreated) {
        console.log("db created");
        // prefill database
      } else {
        console.log("db opened");
      }
    } catch (ex) {
      console.error(ex);
      alert(ex.message);
      Global.isIndexedDbSupported = false;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
