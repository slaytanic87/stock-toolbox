<template>
      <section class="blog text-gray-400 body-font">
      <div class="container px-5 py-24 mx-auto">
        <div class="flex flex-wrap w-full mb-20 flex-col items-center text-center">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-300">Trading Event Calendar</h1>
          <p class="lg:w-1/2 w-full leading-relaxed text-base">
            Handelstage <br/>
            {{new Date()}}
          </p>
        </div>
        <div class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
          <day v-for="(entry, index) in calendar" :key="index"
               :propCountries="entry.countries"
               :propDay="entry.day"
               :propEvent="entry.event"
               :propStatus="entry.status"></day>
        </div>
      </div>
    </section>
</template>

<script>
import Day from "@/components/calendar/Day.vue";
import axios from "axios";
export default {
  name: "Calendar",
  components: {
    "day": Day
  },
  data () {
    return {
      calendar: []
    }
  },
  created () {
    this.fetchCalendar();
  },
  mounted () {
  },
  methods: {
    fetchCalendar () {
      this.calendar = [];
      let url = "/calendar";
      if (process.env.NODE_ENV === "development") {
        url = "http://localhost:9090/calendar";
      }
      axios.get(url).then((resp)=> {
        let dataArr = resp.data;
        dataArr.forEach( (elem) => {
          let dayArr = elem.day.split(".");
          let currentYear = new Date().getFullYear();
          let currentDay = new Date().getDate();
          let currentMonth = new Date().getMonth() + 1;
          if (currentYear === parseInt("20" + dayArr[2]) &&
              currentDay <= parseInt(dayArr[0]) &&
              currentMonth <= parseInt(dayArr[1])) {
            this.calendar.push(elem);
          }

        });
      });
    }
  }
}
</script>

<style scoped>
</style>
