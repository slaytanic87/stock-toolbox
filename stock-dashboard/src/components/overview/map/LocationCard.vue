<template>
  <div class="w-full md:w-1/2 xl:w-1/2 p-3">
    <div class="bg-gray-900 border border-gray-800 rounded shadow">
      <div class="border-b border-gray-800 p-3">
        <h5 class="font-bold uppercase text-gray-600">
          World Map
        </h5>
      </div>
      <div class="p-5">
        <world-map v-bind:tradedCountries="tradedCountries"></world-map>
      </div>
    </div>
  </div>
</template>

<script>
import WorldMap from "./Map";

export default {
  name: "LocationCard",
  components: {
    "world-map": WorldMap
  },
  created() {
  },
  props: {
    propWatchList: {
      required: true
    }
  },
  data () {
    return {
      tradedCountries: {}
    }
  },
  watch: {
    propWatchList: function(newWatchList) {
      this.tradedCountries = [];
      let countryMap = {};
      newWatchList.forEach((data) => {
        if (countryMap[data.countryCode] === undefined) {
          countryMap[data.countryCode] = 1;
        } else {
          countryMap[data.countryCode] += 1;
        }
      });
      this.tradedCountries = countryMap;
    }
  },
  methods: {
    addVisit(countryCode, value) {
      this.$set(this.tradedCountries, countryCode, value);
    }
  }
}
</script>

<style scoped>

</style>
