<template>
  <div>
    <Loading v-if="loadingStatus" />
    <div class="main__container">
    
      <div class="writeup" v-if="!loadingStatus">
        <h2 style="color : #2196f3">{{ today }} - {{ weekEndsAt }} Schedule</h2>
      </div>
      <div class="slots__container" v-if="!loadingStatus"></div>
      <div class="slot__info" v-if="!loadingStatus">
        <div class="slot__week">
          <div
            class="slot__day"
            v-for="(slotDay, index) in slotWithDate"
            :key="new Date(slotDay.date).getDate()"
            @click="thisDatesSlot(index)"
          >
            <h4>{{ new Date(slotDay.date).toDateString() }}</h4>
            <p
              :class="{
                have__slots: howManySlots(slotDay.slots),
                no__slots: !howManySlots(slotDay.slots),
              }"
            >
              {{
                howManySlots(slotDay.slots)
                  ? howManySlots(slotDay.slots) + " slots"
                  : "No slots"
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
                @click="bookThisAppointment(slot)"
                :class="{
                  booked__slot: slot.booked,
                  notBooked__slot: !slot.booked,
                }"
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
                {{ afternoonSlots.length ? afternoonSlots.length : "No" }} Slots
              </p>
            </div>
            <div class="afternoon__slot">
              <div
                class="slot__time"
                v-for="slot in afternoonSlots"
                :key="slot.slotId"
                @click="bookThisAppointment(slot)"
                :class="{
                  booked__slot: slot.booked,
                  notBooked__slot: !slot.booked,
                }"
              >
                <p>{{ formatTime(slot.startTime) }}</p>
              </div>
            </div>
          </div>
          <div v-if="eveningSlots.length">
            <div class="evening">
              <img src="../assets/images/night-mode.png" style="width : 2em" />
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
                @click="bookThisAppointment(slot)"
                :class="{
                  booked__slot: slot.booked,
                  notBooked__slot: !slot.booked,
                }"
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
            <img src="../assets/images/no slots.2.png" class="svg__img" />
            <p>
              Oops, you have not made a slot available.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";
import { getSlots } from "@/Services/Doctor/getSlots";
export default {
  name: "DoctorSlots",
  components: {
    Loading,
  },
  data() {
    return {
      doctors: [],
      slotWithDate: [],
      currentViewingDate: "Today",
      today: "",
      weekEndsAt: "",
      morningSlots: [],
      afternoonSlots: [],
      eveningSlots: [],
      totalSlots: 0,
      doctorId: "",
      doctorName: "",
      doctorSpeciality: "",
      clinicAddress: "",
      loadingStatus: true,
    };
  },
  created() {
    let today = new Date();
    this.today = today.toDateString();
    let todayPlus7 = new Date();
    todayPlus7.setDate(today.getDate() + 7);
    this.weekEndsAt = new Date(todayPlus7).toDateString();
    /**
     * Function that fetches all the slots from backeEnd
     * @author   Ajay
     * @param    { string, string, string } doctorId parameters of a doctor
     * @return   { }
     */
    //call to backend through SERVICES
    getSlots().then((data) => {
      this.loadingStatus = false;
      let slots = data[0].slots;

      console.log("slotWithsATE", slots);

      slots = slots.sort((slot1, slot2) => slot1.date > slot2.date); //sorting the slots Date wise

      let datewiseSlots = this.initialiseDatewiseSltArray(); // initialising with a proper structure required to store info

      this.arrangeSlotsDatewise(datewiseSlots, slots); // filling the values with the data we got from backend(slots)
      console.log(datewiseSlots);
      datewiseSlots[0].show = true;
      this.slotWithDate = datewiseSlots;
      this.slotsView = true;
    });
    console.log("clicked");
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
        nextDay.setDate(today.getDate() + i);

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
        i++;
      }
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
      let variableArray = JSON.parse(JSON.stringify(this.slotWithDate));
      console.log(variableArray);
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
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.main__container {
  width: 95%;
  max-width: 1024px;
  padding-left: 2.5%;
  padding-right: 2.5%;
  background: rgb(243, 241, 241);
}
.loading__div {
  width: 40%;
  margin: auto;
  /* height: 20vh; */
  margin-top: 30%;
  text-align: center;
  /* margin-top: 25%; */
}
.writeup {
  padding-top: 2em;
  margin: 0 auto;
  width: 70%;
  margin-bottom: 2em;
  text-align: center;
  border-bottom: 4px solid #e91e63;
  /* background-color: rgb(228 224 224); */
}

.slot__week {
  display: flex;
  overflow: auto;
  padding: 0.75em 1em;
  background-color: rgb(228 224 224);
  /* margin: auto; */
}
/* Hide scrollbar for Chrome, Safari and Opera */
.slot__week::-webkit-scrollbar {
  display: none;
}

.have__slots {
  color: rgb(5 179 11);
}
.no__slots {
  color: #e91e63;
}
.slot__day {
  text-align: center;
  flex: 0 0 40%;
  border: 2px solid lightgrey;
  border-radius: 0.7em;
  margin-right: 0.75em;
  background-color: white;
}
.slot__day__date {
  text-align: center;
  /* margin: 0 1em;
  margin-top: 1em;
  border-bottom: 0.25em solid rgb(24, 166, 248);
}
.slot__phase {
  /* margin: 1em; */
  margin-top: 2em;
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
.evening__slot {
  padding-bottom: 2%;
}
.slot__time {
  margin-top: 0.75em;
  margin-right: 0.92em;

  border-radius: 0.3em;
  flex: 0 0 20%;
  text-align: center;
}
.notBooked__slot {
  border: 2px solid rgb(48, 171, 243);
}
.booked__slot {
  border: 2px solid #e91e63;
}
.svg__container {
  text-align: center;
  width: 80%;
  margin: auto;
  margin-top: 2em;
}
.svg__img {
  display: block;
  width: 70%;
  margin: auto;
}

@media only screen and (min-width: 621px) {
  .main__container {
    margin: auto;
  }
  .writeup {
    width: 80%;
  }

  .doctor__info img {
    width: 15%;
    border-radius: 4em;
  }
  .slot__info {
    display: flex;
  }
  .slot__week {
    overflow: auto;
    display: block;
    width: 25%;
  }

  .slot__day {
    margin: auto;
    margin-bottom: 0.75em;
    transition: 0.5s;
    cursor: pointer;
  }
  .slot__day:hover {
    transform: scale(1.1);
    border: 2px solid rgb(27, 190, 27);
  }
  .slot__day__date {
    border-bottom: 0.25em solid rgb(24, 166, 248);
    margin: 0;
  }
  .slot__phase {
    width: 70%;
    margin: 0 1em;
  }
  .slot__time {
    flex: 0 0 16%;
    transition: 0.5s;
    cursor: pointer;
  }
  .slot__time:hover {
    transform: scale(1.1);
  }
}
@media only screen and (min-width: 800px) {
  .writeup {
    width: 55%;
  }
}
@media only screen and (max-width: 620px) {
  /* * {
    font-size: 15px;
  } */
  .writeup {
    width: 90%;
  }
  .slot__day {
    flex: 0 0 30%;
  }
  .slot__time {
    flex: 0 0 16%;
  }
}
@media only screen and (max-width: 550px) {
  /* * {
    font-size: 15px;
  } */
  .writeup {
    width: 100%;
  }
  .slot__day {
    flex: 0 0 30%;
  }
  .slot__time {
    flex: 0 0 16%;
  }
}
@media only screen and (max-width: 460px) {
  * {
    font-size: 15px;
  }
  h2 {
    font-size: 1.25em;
  }
}
@media only screen and (max-width: 420px) {
  h2 {
    font-size: 1.1em;
  }
  .slot__day {
    flex: 0 0 45%;
  }
  .slot__time {
    flex: 0 0 27%;
  }
}
@media only screen and (max-width: 340px) {
  * {
    font-size: 13.75px;
  }
  .slot__day {
    flex: 0 0 60%;
  }
  .slot__time {
    flex: 0 0 26%;
  }
}
</style>
