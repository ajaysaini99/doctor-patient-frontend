<template>
  <div>
    <Loading v-if="loadingStatus" />
    <div class="main__container" v-else>
      <div class="writeup" v-if="!slotsView">
        <h2>All dr. Buddies are here</h2>
      </div>
      <div class="doctor__list" v-if="!slotsView">
        <div class="doctor__card" v-for="doctor in doctors" :key="doctor._id">
          <div class="doctor__portfolio">
            <div class="profile__img">
              <img
                src="../assets/images/doctor-profile.jpg"
                alt="doctor's image"
              />
            </div>
            <div class="doctor__info">
              <h3 style="color : #2196f3"><span>Dr </span>{{ doctor.name }}</h3>
              <p style="color : grey">{{ doctor.speciality }}</p>
              <p style="color : grey">5 years of experience</p>
              <div class="doctor__ratings">
                <div>
                  <i class="fas fa-thumbs-up"></i>
                  <span>{{ doctorRating() }}%</span>
                </div>
                <div>
                  <i class="fas fa-comment-alt"></i>
                  <span
                    ><span>{{ patientStories() }}</span
                    >Patient Stories</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="address__info">
            <i class="fas fa-clinic-medical"></i>
            <p>{{ doctor.clinicAddress }}</p>
          </div>
          <div class="book__btn">
            <button
              type="submit"
              @click="
                showSlots(
                  doctor._id,
                  doctor.name,
                  doctor.speciality,
                  doctor.clinicAddress
                )
              "
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
      <div class="slots__container" v-if="slotsView">
        <div class="doctor__info__slot">
          <img src="../assets/images/doctor-profile.jpg" />
          <div>
            <h3 style="color : #2196f3">Dr. {{ formatName(doctorName) }}</h3>
            <p>{{ formatName(doctorSpeciality) }}</p>
          </div>
        </div>
        <div class="slot__info">
          <div class="slot__week">
            <div
              class="slot__day"
              v-for="(slotDay, index) in slotWithDate"
              :key="new Date(slotDay.date).getDate()"
              @click="thisDatesSlot(index)"
            >
              <h3>{{ new Date(slotDay.date).toDateString() }}</h3>
              <p
                :class="{
                  not__available: !howManySlots(slotDay.slots),
                }"
              >
                {{
                  howManySlots(slotDay.slots)
                    ? howManySlots(slotDay.slots) + " slots available"
                    : "Not available"
                }}
              </p>
            </div>
          </div>

          <div class="slot__phase" v-if="showDaySlots()">
            <div class="slot__day__date">
              <h2>{{ currentViewingDate }}</h2>
            </div>

            <div v-if="morningSlots.length">
              <div class="morning">
                <img src="../assets/images/sunrise (1).png" style="width:2em" />
                <h3>Morning</h3>
                <p>
                  {{ morningSlots.length ? morningSlots.length : "No" }}
                  Slots
                </p>
              </div>
              <div class="morning__slot">
                <div
                  class="slot__time"
                  v-for="slot in morningSlots"
                  :key="slot.slotId"
                  @click="bookThisAppointment(slot, 'morning')"
                >
                  <p>{{ formatTime(slot.startTime) }}</p>
                </div>
              </div>
            </div>
            <div v-if="afternoonSlots.length">
              <div class="afternoon">
                <img src="../assets/images/sunny.png" style="width:2em" />
                <h3>Afternoon</h3>
                <p>
                  {{ afternoonSlots.length ? afternoonSlots.length : "No" }}
                  Slots
                </p>
              </div>
              <div class="afternoon__slot">
                <div
                  class="slot__time"
                  v-for="slot in afternoonSlots"
                  :key="slot.slotId"
                  @click="bookThisAppointment(slot, 'afternoon')"
                >
                  <p>{{ formatTime(slot.startTime) }}</p>
                </div>
              </div>
            </div>
            <div v-if="eveningSlots.length">
              <div class="evening">
                <img
                  src="../assets/images/night-mode.png"
                  style="width : 2em"
                />
                <h3>Evening</h3>
                <p>
                  {{ eveningSlots.length ? eveningSlots.length : "No" }} Slots
                </p>
              </div>
              <div class="evening__slot">
                <div
                  class="slot__time"
                  v-for="slot in eveningSlots"
                  :key="slot.slotId"
                  @click="bookThisAppointment(slot, 'evening')"
                >
                  <p>{{ formatTime(slot.startTime) }}</p>
                </div>
              </div>
            </div>
            <div
              class="svg__container"
              v-if="
                !(
                  morningSlots.length ||
                  afternoonSlots.length ||
                  eveningSlots.length
                )
              "
            >
              <img src="../assets/images/noslot6.svg" class="svg__img" />
              <p>
                Oops,
                <span style="font-weight : bold"> Dr {{ doctorName }}</span>
                does not seem to be available.
              </p>
              <p>You may find him on other days.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="confirm__box" v-if="confirmation">
        <form class="confirmation__form">
          <h3>Are you sure you want to book this appointment ?</h3>
          <div class="confirm__btn">
            <button
              type="submit"
              @click.prevent="yesBook"
              style="background-color :rgb(27, 190, 27) "
            >
              Yes
            </button>
            <button
              type="submit"
              @click.prevent="noDontBook"
              style="background-color : #e91e63;"
            >
              No
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";

import Vue from "vue";
import { allDoctors, getSlots } from "@/Services/Patient/doctorList";
import { bookAppointment } from "@/Services/Patient/appointment";
export default {
  name: "DoctorList",
  components: {
    Loading,
  },
  data() {
    return {
      routerLink: { name: "slot" },
      doctors: [],
      ratingList: [78, 89, 96, 97, 85, 94, 76, 99, 91, 93],
      storiesList: [85, 126, 84, 69, 230, 45, 152, 302, 125, 192],
      slotsView: false,
      slotWithDate: [],
      currentViewingDate: "Today",
      morningSlots: [],
      afternoonSlots: [],
      eveningSlots: [],
      totalSlots: 0,
      doctorId: "",
      doctorName: "",
      doctorSpeciality: "",
      clinicAddress: "",
      confirmation: false,
      bookingSlot: "",
      bookingSlotPhase: "",
      loadingStatus: true,
      // slotLoadingStatus: false,
    };
  },
  created() {
    allDoctors()
      .then((data) => {
        this.loadingStatus = false;
        this.doctors = data;
        console.log(this.doctors);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {},
  methods: {
    getRandomIndex() {
      return Math.floor(Math.random() * 10);
    },
    doctorRating() {
      let index = this.getRandomIndex();
      return this.ratingList[index];
    },
    patientStories() {
      let index = this.getRandomIndex();
      return this.storiesList[index];
    },
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

    /**
     * Function that initialises the structure for storing the required information
     * @author   Ajay
     * @param    {  }
     * @return   { Array } initialised array
     */
    initialiseDatewiseSltArray() {
      let array = [];
      let today = new Date();

      for (let i = 0; i < 7; i++) {
        let nextDay = new Date();
        nextDay.setDate(today.getDate() + i); /// [ {today}, { tomorrow}.....]

        array.push({
          // "array" is array of this structure
          date: nextDay,
          slots: { morning: [], afternoon: [], evening: [] },
          show: false,
        });
      }
      return array;
    },
    /**
     * Function that store all the required info in the previously initialised structure
     * @author   Ajay
     * @param    { Array, Array } dateWiseSlots is the array we initialized previously and "slots" is the array of info we got from backend
     * @return   { }
     */
    arrangeSlotsDatewise(datewiseSlots, slots) {
      let i = 0;
      let n = slots.length;

      while (i < n) {
        //looping through all the slots we got from backend

        let currentSlot = slots[i];
        let todayDate = this.formatDate(new Date());
        let currentDate = this.formatDate(new Date(currentSlot.date));

        if (todayDate <= currentDate) {
          // filtering out all the slots of older dates ( taking only present and future dates)

          for (let dateSlot of datewiseSlots) {
            //looping through the future week from today itself

            let date1 = this.formatDate(dateSlot.date);
            let date2 = this.formatDate(currentDate);

            // console.log(date1, "  ", date2);

            if (date1 === date2) {
              // if the date in the future week matches with the date from backend data

              let hours = currentSlot.startTime.hours;
              // let minutes = currentSlot.startTime.minutes;
              let booked = currentSlot.booked;
              let id = currentSlot._id;

              //filtering on the basis of 3 phases of a day( i.e Morning, AfterNoon, Evening)
              if (!booked) {
                if (hours < 12) {
                  dateSlot.slots.morning.push({
                    startTime: currentSlot.startTime,
                    endTime: currentSlot.endTime,
                    booked: booked,
                    slotId: id,
                    date: currentSlot.date,
                  });
                } else if (hours < 17) {
                  dateSlot.slots.afternoon.push({
                    startTime: currentSlot.startTime,
                    endTime: currentSlot.endTime,
                    booked: booked,
                    slotId: id,
                    date: currentSlot.date,
                  });
                } else {
                  dateSlot.slots.evening.push({
                    startTime: currentSlot.startTime,
                    endTime: currentSlot.endTime,
                    booked: booked,
                    slotId: id,
                    date: currentSlot.date,
                  });
                }
              }
            }
          }
        }
        i++;
      }
    },

    /**
     * Function that fetches all the slots from backeEnd
     * @author   Ajay
     * @param    { string, string, string } doctorId parameters of a doctor
     * @return   { }
     */
    showSlots(doctorId, name, speciality, address) {
      this.doctorId = doctorId;
      this.doctorName = name;
      this.doctorSpeciality = speciality;
      this.clinicAddress = address;

      //call to backend through SERVICES
      getSlots(doctorId).then((data) => {
        let slots = data[0].slots;
        // console.log("slotWithsATE", slots);

        slots = slots.sort((slot1, slot2) => slot1.date > slot2.date); //sorting the slots Date wise

        let datewiseSlots = this.initialiseDatewiseSltArray(); // initialising with a proper structure required to store info

        this.arrangeSlotsDatewise(datewiseSlots, slots); // filling the values with the data we got from backend(slots)
        // console.log(datewiseSlots);
        datewiseSlots[0].show = true;
        this.slotWithDate = datewiseSlots;
        this.slotsView = true;
        // this.slotLoadingStatus = false;
      });
      console.log("clicked");
    },

    /**
     * Function that shows the all the slots of a particular day from the week ( @click)
     * @author   Ajay
     * @param    { Number} idx index of the the day from the array of future week days
     * @return   { }
     */

    thisDatesSlot(idx) {
      console.log("clicking");
      let allSlots = JSON.parse(JSON.stringify(this.slotWithDate));
      for (let day of allSlots) {
        // assigning false to "show" property of all the days of the future week
        day.show = false;
      }
      allSlots[idx].show = true;
      this.slotWithDate = allSlots; // assigning true to "show" property to the day ( whose slots we want to see)
    },

    /**
     * Function that sorts the slots on the basis of time
     * @author   Ajay
     * @param    { Array} idx index of the the day from the array of future week days
     * @return   { }
     */
    sortSlots(slotsArray) {
      let array = slotsArray.sort((time1, time2) => time1 < time2);

      return array;
    },
    showDaySlots() {
      this.slotLoadingStatus = true;
      let variableArray = JSON.parse(JSON.stringify(this.slotWithDate));
      // console.log(variableArray);
      for (let day of variableArray) {
        if (day.show) {
          console.log(day.date);
          let selectedDate = new Date(day.date);

          this.currentViewingDate = selectedDate.toDateString();
          this.morningSlots = this.sortSlots(day.slots.morning);
          this.afternoonSlots = this.sortSlots(day.slots.afternoon);
          this.eveningSlots = this.sortSlots(day.slots.evening);
          // console.log(day.slots.morning);
          // sortSlots();
          return true;
        }
      }
      return false;
    },
    howManySlots(slots) {
      this.totalSlots =
        slots.morning.length + slots.afternoon.length + slots.evening.length;
      // console.log(this.totalSlots);
      return this.totalSlots;
    },

    /**********************************
     Book an appointment
     ************************/

    removeSlotFromPhase() {
      let phase = this.bookingSlotPhase;
      let slotId = this.bookingSlot.slotId;
      let date = this.bookingSlot.date;
      date = new Date(date);

      console.log("phase", phase, "slotId", slotId, "date", date);
      let index;
      for (let i = 0; i < 7; i++) {
        console.log("slot Dtae in array", this.slotWithDate[i].date);
        if (date.getDate() === new Date(this.slotWithDate[i].date).getDate()) {
          console.log("in if block");
          if (phase === "morning") {
            let m = this.slotWithDate[i].slots.morning.length;

            for (let j = 0; j < m; j++) {
              if (slotId === this.slotWithDate[i].slots.morning[j].slotId) {
                index = j;
                break;
              }
            }

            this.slotWithDate[i].slots.morning.splice(index, 1);
            console.log("new slots", this.slotWithDate[i].slots.morning);
          } else if (phase === "afternoon") {
            let m = this.slotWithDate[i].slots.afternoon.length;

            for (let j = 0; j < m; j++) {
              if (slotId === this.slotWithDate[i].slots.afternoon[j].slotId) {
                index = j;
                break;
              }
            }
            this.slotWithDate[i].slots.afternoon.splice(index, 1);
          } else if (phase === "evening") {
            let m = this.slotWithDate[i].slots.evening.length;

            for (let j = 0; j < m; j++) {
              if (slotId === this.slotWithDate[i].slots.evening[j].slotId) {
                index = j;
                break;
              }
            }
            this.slotWithDate[i].slots.evening.splice(index, 1);
          }
        }
      }
   
    },
    noDontBook() {
      this.confirmation = false;
    },
    okay() {
      this.confirmation = false;
    },
    /**
     * Function that make an appointment
     * @author   Ajay
     * @param    { Object } slot object of slot details
     * @return   {  }
     */

    yesBook() {
      console.log("slot DEtails ", this.bookingSlot);
      let details = {
        doctorId: this.doctorId,
        slotId: this.bookingSlot.slotId,
      };

      console.log("slot id and doctor id", details);
      let slotDetails = {
        startTime: this.bookingSlot.startTime,
        endTime: this.bookingSlot.endTime,
        date: this.bookingSlot.date,
        doctorInfo: {
          name: this.doctorName,
          speciality: this.doctorSpeciality,
          clinicAddress: this.clinicAddress,
        },
      };
      console.log(this.bookingSlot.date);
      console.log("clicked");
      bookAppointment(details, slotDetails)
        .then(() => {
          try {
            this.removeSlotFromPhase();
          } catch (error) {
            Vue.$toast.open({
              message: "Added",
              duration: 5000,
              type: "success",
            });
          }
          this.confirmation = false;
          setTimeout(() => {
            Vue.$toast.open({
              message: "Appointment Added",
              duration: 5000,
              type: "success",
            });
          }, 2000);

          console.log("appointment made succesfully");
        })
        .catch((error) => {
          console.log(error);
          Vue.$toast.open({
            message: error.message,
            duration: 5000,
            type: "error",
          });
        });
    },

    bookThisAppointment(slot, phase) {
      this.bookingSlotPhase = phase;
      this.bookingSlot = slot;
      this.confirmation = true;
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
  margin-top: 1em;
  color: white;
}
.main__container {
  width: 95%;
  max-width: 1024px;
  margin: auto;
  background: rgb(243, 241, 241);
  padding: 0 2.5%;
  min-height: 90vh;
}
.writeup {
  padding-top: 1em;
  width: 80%;
  margin: auto;
  margin-bottom: 2em;
  text-align: center;
  color: #045da7;
  border-bottom: 4px solid #e91e63;
}

.doctor__card {
  margin: 1em 0;
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
  /* width: 80%; */
}
.profile__img {
  width: 40%;
  padding: 0.25em;
  /* border-radius: 5em; */
}
.profile__img img {
  width: 80%;
  border-radius: 5em;
}

.doctor__ratings {
  margin-top: 0.5em;
  display: flex;
}
.doctor__ratings span {
  margin-left: 0.25em;
  margin-right: 0.5em;
}
.fa-thumbs-up,
.fa-comment-alt {
  color: rgb(5 179 11);
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
  background: #2196f3;
  color: #fff;
  border: none;
  padding: 0.5em;
  cursor: pointer;
  font-weight: 500;
  border-radius: 0.5em;
  transition: 0.5s;
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

@media only screen and (max-width: 355px) {
  .doctor__ratings {
    display: block;
  }
}
@media only screen and (max-width: 310px) {
  .profile__img {
    width: 30%;
    padding: 0.25em;
    /* border-radius: 5em; */
  }
}

@media only screen and (min-width: 535px) {
  /* * {
    font-size: 15px;
  } */
  .main__container {
    width: 95%;
  }
  .writeup {
    width: 50%;
  }
  .profile__img {
    width: 30%;
  }
  .doctor__list {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
  .doctor__card {
    flex: 0 0 45%;
  }
  .doctor__ratings {
    display: block;
  }
}
@media (min-width: 767px) {
  /* * {
    font-size: 15px;
  } */
  .writeup {
    width: 38%;
  }
}

@media (min-width: 1024px) {
  /* * {
    font-size: 16px;
  } */
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

/******************************************
          Slots container
**************************************** */
.doctor__info__slot {
  display: flex;
  padding-top: 1em;
  padding-bottom: 2em;
}

.go__back__btn {
  display: none;
  width: 15%;
  margin-left: 25%;
  align-items: center;
}
.slot__week {
  display: flex;
  overflow: scroll;
  padding: 0.75em 1em;
  background-color: rgb(228 224 224);
}

.slot__day {
  text-align: center;
  flex: 0 0 40%;
  border: 2px solid lightgrey;
  border-radius: 0.7em;
  margin-right: 0.75em;
  background-color: white;
  cursor: pointer;
  transition: 0.5s;
}
.slot__day:hover {
  transform: scale(1.1);
  border: 2px solid rgb(27, 190, 27);
}
.slot__day p {
  color: rgb(27, 190, 27);
}

.slot__day__date {
  text-align: center;
  /* margin: 0 1em; */
  margin-top: 1em;
  border-bottom: 0.25em solid rgb(24, 166, 248);
}
.not__available {
  color: #e91e63 !important;
}
.slot__phase {
  margin: 1em;
}
.morning,
.afternoon,
.evening {
  display: flex;
  align-items: center;
  margin-top: 1.5em;
}
.morning *,
.evening *,
.afternoon * {
  margin-right: 1em;
}
.morning__slot,
.afternoon__slot,
.evening__slot {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.slot__time {
  margin-top: 0.75em;
  margin-right: 0.92em;
  border: 2px solid rgb(48, 171, 243);
  border-radius: 0.3em;
  flex: 0 0 20%;
  text-align: center;
  cursor: pointer;
  transition: 0.5s;
}
.slot__time:hover {
  transform: scale(1.1);
  border: 2px solid rgb(27, 190, 27);
}
.svg__container {
  text-align: center;
  width: 80%;
  margin: auto;
}
.svg__img {
  /* display: block; */
  width: 70%;
  margin: auto;
}
@media only screen and (min-width: 621px) {
  /* * {
    font-size: 15px;
  } */
  .main__container {
    width: 95%;
  }
  .doctor__info__slot {
    align-items: center;
  }

  .doctor__info__slot img {
    width: 15%;
    border-radius: 4em;
    padding-left: 0.5em;
  }
  .slot__info {
    display: flex;
  }
  .slot__week {
    display: block;
    width: 38%;
  }
  .slot__day {
    margin-bottom: 0.75em;
  }
  .slot__day__date {
    border-bottom: 0.25em solid rgb(24, 166, 248);
    margin: 0;
  }
  .slot__phase {
    width: 80%;
    margin: 0 1em;
  }
  .slot__time {
    flex: 0 0 18%;
  }
}
@media only screen and (min-width: 820px) {
  .slot__week {
    display: block;
    width: 30%;
  }
  .slot__time {
    flex: 0 0 16%;
  }
}
@media only screen and (max-width: 620px) {
  /* * {
    font-size: 15px;
  } */
  .slot__day {
    flex: 0 0 30%;
  }
  .slot__time {
    flex: 0 0 16%;
  }
}
@media only screen and (max-width: 550px) {
  /* * {
    font-size: 16px;
  } */
  .slot__day {
    flex: 0 0 32%;
  }
  .slot__time {
    flex: 0 0 16%;
  }
}
@media only screen and (max-width: 420px) {
  /* * {
    font-size: 14px;
  } */
  .slot__day {
    flex: 0 0 45%;
  }
  .slot__time {
    flex: 0 0 27%;
  }
}
@media only screen and (max-width: 340px) {
  /* * {
    font-size: 14px;
  } */
  .slot__day {
    flex: 0 0 60%;
  }
  .slot__time {
    flex: 0 0 26%;
  }
}
</style>
