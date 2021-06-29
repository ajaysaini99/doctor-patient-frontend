<template>
  <div>
    <AppNavbar />
    <!-- <SlotsPatient /> -->
    <router-view />
  </div>
</template>

<script>
import AppNavbar from "@/components/AppNavbar.vue";
// import Register from '@/components/Register.vue'
// import Login from '@/components/Login.vue'
// import DoctorList from '@/components/DoctorList'
// import AppointedDoctors from '@/components/AppointedDoctors'
// import SlotsPatient from "@/components/SlotsPatient";

export default {
  name: "App",
  components: {
    // Login,
    // Register,
    AppNavbar,
    // SlotsPatient,
    // DoctorList,
    // AppointedDoctors
  },
};
</script>

<style>
body {
  caret-color: transparent;
}
</style>
