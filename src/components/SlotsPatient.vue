<template>
  <div class="main__container">
    <div class="doctor__info">
      <img src="../assets/images/doctor-profile.jpg" />
      <div>
        <h3>Dr Ramesh Kumar</h3>
        <p>Hair specialist</p>
      </div>
    </div>
    <div class="slot__info">
      <div class="slot__week">
        <div class="slot__day">
          <h3>Thu, 24 Jun</h3>
          <p>20 slots available</p>
        </div>
        <div class="slot__day">
          <h3>Thu, 24 Jun</h3>
          <p>20 slots available</p>
        </div>
      </div>

      <div class="slot__phase">
        <div class="slot__day__date">
          <h2>Thu, 24 Jun</h2>
        </div>

        <div>
          <div class="morning">
            <img src="../assets/images/sunrise (1).png" style="width:2em" />
            <h3>Morning</h3>
            <p>5 Slots</p>
          </div>
          <div class="morning__slot">
            <div class="slot__time">
              <p>12:45 AM</p>
            </div>
          </div>
        </div>
        <div>
          <div class="afternoon">
            <img src="../assets/images/sunny.png" style="width:2em" />
            <h3>Afternoon</h3>
            <p>5 Slots</p>
          </div>
          <div class="afternoon__slot">
            <div class="slot__time">
              <p>12:45 PM</p>
            </div>
          </div>
        </div>
        <div>
          <div class="evening">
            <img src="../assets/images/night-mode.png" style="width : 2em" />
            <h3>Evening</h3>
            <p>5 Slots</p>
          </div>
          <div class="evening__slot">
            <div class="slot__time">
              <p>5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SlotsPatient",
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.main__container {
  width: 95%;
  max-width: 920px;
  margin: auto;
}
.doctor__info {
  display: flex;
  margin: 1em;
  margin-bottom: 2em;
}
.doctor__info img {
  width: 15%;
  border-radius: 2em;
  margin-right: 1em;
}
.slot__week {
  display: flex;
  overflow: scroll;
  padding: 0.75em 1em;
  background-color: rgb(241, 241, 241);
}
/* Hide scrollbar for Chrome, Safari and Opera */
.slot__week::-webkit-scrollbar {
  display: none;
}
.slot__week {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
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
  /* margin: 0 1em; */
  margin-top: 1em;
  border-bottom: 0.25em solid rgb(24, 166, 248);
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
}
@media only screen and (min-width: 621px) {
  * {
    font-size: 15px;
  }
  /* .main__container {
    width: 100%;
  } */
  .doctor__info {
    align-items: center;
  }

  .doctor__info img {
    width: 15%;
    border-radius: 4em;
  }
  .slot__info {
    display: flex;
  }
  .slot__week {
    display: block;
    width: 25%;
  }
  .slot__day {
    margin-bottom: 0.75em;
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
  }
}
@media only screen and (max-width: 620px) {
  * {
    font-size: 15px;
  }
  .slot__day {
    flex: 0 0 30%;
  }
  .slot__time {
    flex: 0 0 16%;
  }
}
@media only screen and (max-width: 550px) {
  * {
    font-size: 15px;
  }
  .slot__day {
    flex: 0 0 30%;
  }
  .slot__time {
    flex: 0 0 16%;
  }
}
@media only screen and (max-width: 420px) {
  * {
    font-size: 14px;
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
    font-size: 14px;
  }
  .slot__day {
    flex: 0 0 60%;
  }
  .slot__time {
    flex: 0 0 26%;
  }
}
</style>
