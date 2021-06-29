<template>
  <div>
    <Loading v-if="loadingStatus" />
    <div class="main__container" v-if="!loadingStatus">
      <div class="writeup" v-if="patientArray.length">
        <h2>Your appointments</h2>
      </div>
      <div class="loading__div" v-if="loadingStatus">
        <h3 style=" color : #045da7">
          We are fetching appointments... Hang on!
          <i class="fa fa-spinner fa-spin" style="font-size:24px"></i>
        </h3>
      </div>

      <div class="doctor__list" v-else>
        <div
          class="doctor__card"
          v-for="appointment in patientArray"
          :key="appointment._id"
        >
          <div class="doctor__portfolio">
            <div class="profile__img">
              <img src="../assets/images/patient.png" alt="doctor's image" />
            </div>
            <div class="doctor__info">
              <div class="timings">
                <h3>
                  <i class="fas fa-calendar-day"></i
                  >{{ formatDate(appointment.date) }}
                </h3>
                <h4>
                  <i class="fas fa-clock"></i
                  >{{ formatTime(appointment.startTime) }} -
                  {{ formatTime(appointment.endTime) }}
                </h4>
              </div>
              <h3 style="color : #2196f3">
                {{ formatName(appointment.patientInfo.name) }}
              </h3>
            </div>
          </div>
          <div class="book__btn">
            <button type="submit" @click="cancelThisAppointment(appointment)">
              Cancel Appointment
            </button>
          </div>
        </div>
      </div>
      <div class="confirm__box" v-if="confirmation">
        <form class="confirmation__form">
          <h3>Are you sure you want to cancel this appointment ?</h3>
          <div class="confirm__btn">
            <button
              type="submit"
              @click.prevent="yesCancel"
              style="background-color :rgb(27, 190, 27) "
            >
              Yes
            </button>
            <button
              type="submit"
              @click.prevent="noDontCancel"
              style="background-color : #e91e63;"
            >
              No
            </button>
          </div>
        </form>
      </div>
      <div
        class="no__appointment"
        v-if="!patientArray.length && !loadingStatus"
      >
        <h3>No appointment found</h3>
        <img src="../assets/images/noslot5.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";

import Vue from "vue";
import { getPatients } from "@/Services/Doctor/getPatients";
import { cancelAppointment } from "@/Services/Doctor/getPatients";
export default {
  name: "PatientList",
  components: {
    Loading,
  },
  data() {
    return {
      patientArray: [],
      confirmation: false,
      cancelAppointmentDetails: "",
      loadingStatus: true,
    };
  },
  created() {
    getPatients()
      .then((data) => {
        this.patientArray = data;
        this.loadingStatus = false;

        console.log(" fetcthing", data);
      })
      .catch((error) => {
        this.loadingStatus = false;

        return error;
      });
  },
  methods: {
    formatDate(date) {
      let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
    formatTime(slot) {
      let { hours, minutes } = slot;
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      let fullTime = "";

      if (hours < 12) {
        fullTime += hours + ":" + minutes + " AM";
      } else if (hours === 12) {
        fullTime += hours + ":" + minutes + " PM";
      } else {
        fullTime += hours - 12 + ":" + minutes + " PM";
      }
      return fullTime;
    },
    formatName(name) {
      let nameArray = name.split(" ");
      nameArray = nameArray.map(
        (name) => name.charAt(0).toUpperCase() + name.slice(1)
      );

      let fullName = "";
      for (let i = 0; i < nameArray.length; i++) {
        fullName += nameArray[i] + " ";
      }
      return fullName;
    },
    cancelThisAppointment(appointment) {
      this.cancelAppointmentDetails = appointment;
      console.log("appointment", appointment);
      this.confirmation = true;
    },
    yesCancel() {
      let details = {
        patientId: this.cancelAppointmentDetails.patientId,
        slotId: this.cancelAppointmentDetails.slotId,
      };
      console.log("details are ", details);

      cancelAppointment(details)
        .then(() => {
          console.log("just deleting");
          this.confirmation = false;
          this.patientArray = this.patientArray.filter(
            (appointment) => appointment.slotId !== details.slotId
          );
          Vue.$toast.open({
            message: "Appointment Cancelled",
            duration: 5000,
            type: "success",
          });
        })
        .catch((error) => {
          console.log(error);

          this.confirmation = true;
          Vue.$toast.open({
            message: error.message,
            duration: 5000,
            type: "error",
          });
          return error;
        });
      this.confirmation = true;
    },
    noDontCancel() {
      this.cancelAppointmentDetails = "";
      this.confirmation = false;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
body {
  margin: 0;
  padding: 0;
  color: white;
}

/**********************
Mobile First Approach
********************* */

.main__container {
  width: 95%;
  max-width: 1024px;
  min-height: 90vh;
  margin: auto;
  background: rgb(248, 248, 248);
  padding: 0 2.5%;
}
.writeup {
  padding-top: 1em;
  text-align: center;
  color: #045da7;
  width: 75%;
  margin: auto;
  margin-bottom: 2em;
  border-bottom: 4px solid #e91e63;
}
.loading__div {
  align-items: center;
  width: 100%;
  background-color: rgb(228 224 224);
  text-align: center;
  margin: auto;
  /* margin-top: 45%; */
}
.doctor__card {
  margin: 0.75em 0;
  border-radius: 0.7em;
  background: linear-gradient(rgb(240, 248, 251), rgb(237, 244, 247));
  padding: 0.5em;
  box-shadow: 2px 2px 3px 3px rgb(164, 164, 167);
  transition: 0.5s;
}
.doctor__card:hover {
  transform: scale(1.05);
}
.doctor__portfolio {
  display: flex;
}
.profile__img {
  width: 40%;
  padding: 0.25em;
}
.profile__img img {
  width: 80%;
  border-radius: 5em;
}

.fa-calendar-day,
.fa-clock {
  font-size: 1em;
  margin-right: 0.5em;
}

.address__info {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 0.5em;
}
.fa-clinic-medical {
  color: #2196f3;
  font-size: 1.25em;
  margin-right: 0.5em;
}
.book__btn button {
  font-size: 0.95em;
  background: #e91e63;
  color: #fff;
  border: none;
  padding: 0.5em;
  cursor: pointer;
  font-weight: 500;
  border-radius: 0.5em;
}

.book__btn button:hover {
  background: #e91e63;
}

.input__box input[type="submit"] {
  background: #2196f3;
  color: #fff;
  border: none;
  max-width: 8em;
  cursor: pointer;
  font-weight: 500;
}
/**************************
Confirmation box
******************* */
.confirm__box {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(204, 230, 255, 0.6);
  z-index: 100;
}
.confirmation__form {
  border: 1px solid black;
  width: 80vw;
  position: relative;
  top: 40vh;
  margin: auto;
  text-align: center;
  padding: 0.75em;
  background: rgb(135, 160, 230);
  border-radius: 0.5em;
  color: black;
  max-width: 22em;
}
.confirm__btn {
  width: 50%;
  margin: auto;
  display: flex;
  margin-top: 1em;
  justify-content: space-between;
}
.confirm__btn button {
  padding: 0.5em 0.75em;
  border: none;
  border-radius: 0.25em;
  color: white;
  cursor: pointer;
}

/******************
No appointments
************** */
.no__appointment {
  margin: auto;
  padding-top: 10vh;
  width: 80%;
  /* min-height: 100vh; */
  text-align: center;
}
.no__appointment h3 {
  color: white;
  border-radius: 0.75em;
  background: radial-gradient(rgb(46, 219, 219), rgb(96, 184, 224));
  width: 50vw;
  max-width: 80%;
  margin: auto;
}
.no__appointment img {
  width: 60%;
  display: block;
  margin: auto;
}
.no__appointment h4 a {
  color: #2196f3;
}

/**********************
Responsivenes
********************* */
@media only screen and (max-width: 310px) {
  .profile__img {
    width: 30%;
    padding: 0.25em;
    /* border-radius: 5em; */
  }
}
@media only screen and (max-width: 355px) {
  .doctor__ratings {
    display: block;
  }
}
@media only screen and (min-width: 400px) {
  .writeup {
    width: 60%;
  }
}

@media only screen and (min-width: 535px) {
  /* * {
    font-size: 14px;
  } */
  h2 {
    font-size: 1.75em;
  }
  .writeup {
    width: 50%;
  }
  .loading__div {
    width: 70%;
    margin: auto;
    /* margin-top: 25%; */
  }
  .doctor__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .doctor__card {
    flex: 0 0 46%;
  }
  .doctor__ratings {
    display: block;
  }
}
@media (min-width: 767px) {
  .writeup {
    width: 40%;
  }
  .loading__div {
    width: 50%;
    /* margin-top: 25%; */
  }
}

@media (min-width: 1024px) {
  /* * {
    font-size: 16px;
  } */
}
</style>
