<template>
      <section class="blog text-gray-400 body-font">
      <div class="container px-5 py-24 mx-auto">
        <loading-splash v-if="calendar.length === 0"></loading-splash>
        <div v-if="calendar.length > 0" class="flex flex-wrap w-full mb-20 flex-col items-center text-center">
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
import LoadingSplash from "@/components/LoadingSplash";
import axios from "axios";
export default {
  name: "Calendar",
  components: {
    "day": Day,
    "loading-splash": LoadingSplash
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
    async fetchCalendar () {
      this.calendar = [];
      let url = "/calendar";
      if (process.env.NODE_ENV === "development") {
        url = `http://localhost:9090${url}`;
      }
      axios.get(url).then((resp)=> {
        this.calendar = resp.data;
      });
    }
  }
}
</script>

<style scoped>
</style>
