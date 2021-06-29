<template>
  <div class="main__container">
    <form class="form" @submit.prevent="makeSlots">
      <div class="heading__container">
        <h2>Make slots available</h2>
      </div>
      <div class="input__box">
        <label for="date">Date</label>
        <input
          type="date"
          id="date"
          v-model="form.date"
          @blur="$v.form.date.$touch()"
        />
        <div
          style="color :#ce0101;"
          class="errors__usertype"
          v-if="$v.form.date.$error"
        >
          <div v-if="!$v.form.date.required">
            <small>Date is required.</small>
          </div>
          <div v-else-if="!$v.form.date.isDateFine">
            <small>Date must be within a week from today</small>
          </div>
        </div>
      </div>
      <div class="time">
        <div class="bold">Start time</div>
        <div class="full__time">
          <div class="input__box">
            <select
              name="endHour"
              id="endHour"
              v-model="form.startTime.hours"
              @blur="$v.form.startTime.hours.$touch()"
            >
              <option value="null">HH</option>
              <option v-for="hour in hours" :key="hour">{{ hour }}</option>
            </select>
          </div>
          <div>:</div>
          <div class="input__box">
            <select
              name="startMinute"
              id="startMinute"
              v-model="form.startTime.minutes"
              @blur="$v.form.startTime.minutes.$touch()"
            >
              >
              <option value="null">MM</option>
              <option value="0">0</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>
          </div>
        </div>
        <div
          style="color :#ce0101;"
          class="errors__usertype"
          v-if="$v.form.startTime.hours.$error"
        >
          <div v-if="!$v.form.startTime.hours.required">
            <small>Start hour is required</small>
          </div>
        </div>

        <div
          style="color :#ce0101;"
          class="errors__usertype"
          v-if="$v.form.startTime.minutes.$error"
        >
          <div v-if="!$v.form.startTime.minutes.required">
            <small>Start minute is required</small>
          </div>
        </div>
      </div>

      <div class="time">
        <div class="bold">End time</div>
        <div class="full__time">
          <div>
            <select
              name="endHour"
              id="endHour"
              v-model="form.endTime.hours"
              @blur="$v.form.endTime.hours.$touch()"
            >
              <option value="null">HH</option>
              <option v-for="hour in hours" :key="hour">{{ hour }}</option>
            </select>
          </div>

          <div>:</div>
          <div class="input__box">
            <select
              name="endMinute"
              id="endMinute"
              v-model="form.endTime.minutes"
              @blur="$v.form.endTime.minutes.$touch()"
            >
              <option value="null">MM</option>
              <option value="0">0</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>
          </div>
        </div>
        <div
          style="color :#ce0101;"
          class="errors__usertype"
          v-if="$v.form.endTime.hours.$error"
        >
          <div v-if="!$v.form.endTime.hours.required">
            <small>End hour is required</small>
          </div>
        </div>

        <div
          style="color :#ce0101;"
          class="errors__usertype"
          v-if="$v.form.endTime.minutes.$error"
        >
          <div v-if="!$v.form.endTime.minutes.required">
            <small>End minute is required</small>
          </div>
        </div>
      </div>

      <div class="duration">
        <div class="bold">Duration</div>
        15 Min
        <input
          type="radio"
          value="15"
          name="time_duration"
          v-model="form.duration"
          @blur="$v.form.duration.$touch()"
        />
        30 Min
        <input
          type="radio"
          value="30"
          name="time_duration"
          v-model="form.duration"
          @blur="$v.form.duration.$touch()"
        />
        <div
          style="color :#ce0101;"
          class="errors__usertype"
          v-if="$v.form.duration.$error"
        >
          <div v-if="!$v.form.duration.required">
            <small>Duration is required</small>
          </div>
          <div v-if="isTimeFine">
            <small>Duration must be correct.</small>
          </div>
        </div>
      </div>

      <div class="submit__btn">
        <input type="submit" value="Submit" />
      </div>
    </form>
  </div>
</template>

<script>
import { makeSlotsAvailable } from "@/Services/Doctor/makeSlots";
import Vue from "vue";
import { required } from "vuelidate/lib/validators";

export default {
  name: "MakeSlots",
  data() {
    return {
      hours: [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
      ],
      form: {
        date: "",
        startTime: {
          hours: null,
          minutes: null,
        },
        endTime: {
          hours: null,
          minutes: null,
        },
        duration: null,
      },
      isTimeFine: "",
      isDisabled: true,
    };
  },
  validations: {
    form: {
      date: {
        required,
        isDateFine: function(date) {
          date = new Date(date);
          let today = new Date();
          // console.log("date", date.toDateString());
          // console.log("today", today.toDateString());

          let todayPlus7 = new Date();
          todayPlus7.setDate(today.getDate() + 7);

          if (
            (date <= todayPlus7 && date >= today) ||
            today.toDateString() === date.toDateString()
          ) {
            console.log("date validation passed");
            return true;
          } else {
            return false;
          }
        },
      },
      startTime: {
        hours: { required },
        minutes: { required },
      },
      endTime: {
        hours: { required },
        minutes: { required },
      },
      duration: { required },
    },
  },
  methods: {
    convertToSlots() {
      let slotsArray = [];
      let prevHour = parseInt(this.form.startTime.hours);
      let prevMinute = parseInt(this.form.startTime.minutes);
      let endHour = parseInt(this.form.endTime.hours);
      let endMinute = parseInt(this.form.endTime.minutes);
      let length = parseInt(this.form.duration);
      console.log(prevHour, prevMinute, endHour, endMinute, length);

      let totalSlots =
        (60 - prevMinute + 60 * (endHour - prevHour - 1) + endMinute) / length;
      console.log(totalSlots);
      while (totalSlots--) {
        let nextHour = prevHour + Math.floor((prevMinute + length) / 60);
        let nextMinute = (prevMinute + length) % 60;

        let slot = {
          date: this.form.date,
          startTime: {
            hours: prevHour,
            minutes: prevMinute,
          },
          endTime: {
            hours: nextHour,
            minutes: nextMinute,
          },
        };
        slotsArray.push(slot);
        prevHour = nextHour;
        prevMinute = nextMinute;
      }
      return slotsArray;
    },
    validateDate(date) {
      date = new Date(date);
      let today = new Date();

      let todayPlus7 = new Date();
      todayPlus7.setDate(today.getDate() + 7);

      if (date <= todayPlus7 && date >= today) {
        console.log("date validation passed");
        return true;
      } else {
        return false;
      }
    },
    validateTime() {
      let prevHour = parseInt(this.form.startTime.hours);
      let prevMinute = parseInt(this.form.startTime.minutes);
      let endHour = parseInt(this.form.endTime.hours);
      let endMinute = parseInt(this.form.endTime.minutes);
      let length = parseInt(this.form.duration);

      let startHash = prevHour * 100 + prevMinute;
      let endHash = endHour * 100 + endMinute;
      console.log(startHash, endHash);

      console.log(prevHour, prevMinute, endHour, endMinute, length);

      let totalSlots =
        (60 - prevMinute + 60 * (endHour - prevHour - 1) + endMinute) / length;

      if (totalSlots === Math.floor(totalSlots)) {
        if (startHash < endHash) {
          this.isTimeFine = false;
          return true;
        } else {
          Vue.$toast.open({
            message: "End time must be greater than start time",
            duration: 5000,
            type: "error",
          });
          return false;
        }
      } else {
        Vue.$toast.open({
          message: "Duration must be correct.",
          duration: 5000,
          type: "error",
        });
        // this.isTimeFine = false;
      }
    },

    validation() {
      let date = this.form.date;
      let startHour = this.form.startTime.hours;
      let startMinute = this.form.startTime.minutes;
      let endHour = this.form.endTime.hours;
      let endMinute = this.form.endTime.minutes;
      let duration = this.form.duration;

      if (
        date &&
        startHour &&
        startMinute &&
        endHour &&
        endMinute &&
        duration
      ) {
        if (!this.validateDate(date)) {
          /// Vuelidate it ---> date validation failed
          console.log("date not valid");

          return false;
        } else if (!this.validateTime()) {
          /// Vuelidate it ---> time validation failed
          console.log("time not valid");
          return false;
        } else {
          console.log("everything fine in validations");

          return true;
        }
      } else {
        /// validation errors
        return false;
      }
    },
    makeSlots() {
      console.log(this.form);

      this.$v.form.$touch();

      if (!this.$v.form.$invalid && this.validation()) {
        console.log("all validation passed");

        let formDetails = this.convertToSlots();
        console.log(formDetails);
        makeSlotsAvailable(this.convertToSlots())
          .then((data) => {
            /// veulidate --> slots have been posted
            this.form.date = "";
            this.form.startTime.hours = null;
            this.form.startTime.minutes = null;
            this.form.endTime.hours = null;
            this.form.endTime.minutes = null;
            this.form.duration = null;

            Vue.$toast.open({
              message: "Slots added successfully",
              duration: 5000,
              type: "success",
            });
            console.log("data ", data);
          })
          .catch((error) => {
            /// veulidate --> error ocuured
            Vue.$toast.open({
              message: error.message,

              duration: 5000,
              type: "error",
            });
            console.log("error in vue", error);
          });
      } else {
        Vue.$toast.open({
          message: "Form validations failed",
          duration: 5000,
          type: "error",
        });
        console.log("validation failed");
        ////vuelidate it ---> form details are not correct
      }
    },
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
.main__container {
  width: 95%;
  max-width: 1024px;
  margin: auto;
  min-height: 78vh;
  padding: 5% 2.5%;
  background: rgb(245, 246, 244);
}
.form {
  width: 70%;
  margin: auto;
  border-radius: 5%;
  padding: 5%;
  background: linear-gradient(rgb(208, 236, 245), rgb(198, 215, 240));
}
.heading__container {
  border-bottom: 2px solid #e91e63;
  margin-bottom: 1em;
}
label {
  display: block;
  /* margin-top: 1em; */
}
#date {
  font-size: 1.1rem;
}
input,
select {
  border: none;
  padding: 0.35em;
  color: black;

  border-radius: 0.25em;
  /* margin-bottom: 1em; */

  font-size: 1em;
}
input:focus,
select:focus {
  border: 2px solid rgb(48, 171, 243);
  color: black;
  caret-color: auto !important;
}
input:hover,
select:hover {
  cursor: pointer;
}
.full__time {
  display: flex;
}
.full__time div {
  margin-right: 0.25em;
}
.duration input {
  margin-right: 0.75em;
}
.submit__btn input {
  background-color: rgb(48, 171, 243);
  padding: 0.7em;
  color: white;
  margin-top: 1em;
}
.submit__btn input:hover {
  background-color: #e91e63;
}
.submit__btn input[disabled] {
  background-color: #cccccc;
  color: #666666;
}
.bold,
label {
  font-weight: bold;
  margin-top: 1em;
}
@media only screen and (min-width: 539px) {
  .form {
    width: 50%;
    padding: 2% 5%;
    left: 20%;
  }
}
@media only screen and (min-width: 767px) {
  .form {
    width: 45%;
    padding: 2% 5%;
    left: 22.5%;
  }
}

@media only screen and (min-width: 850px) {
  .form {
    width: 30%;
    padding: 2% 5%;
    left: 30%;
  }
}
</style>
