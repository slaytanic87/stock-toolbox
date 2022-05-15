<template>
  <div>
    <vue-world-map id="worldmap"
                   v-bind:countryData="tradedCountries"
                   v-bind:defaultCountryFillColor="defaultCountryFillColor"
                   v-bind:highColor="highColor"
                   v-bind:countryStrokeColor="countryStrokeColor"
                   v-bind:lowColor="lowColor"></vue-world-map>
  </div>
</template>

<script>
import VueWorldMap from "./lib/VueWorldMap";

export default {
  name: "Map",
  components: {
    "vue-world-map": VueWorldMap
  },
  props: {
    tradedCountries: Object
  },
  data () {
    return {
      defaultCountryFillColor: '#01013c',
      highColor: 'red',
      lowColor: 'blue',
      countryStrokeColor: 'green'
    }
  }
}
</script>

<style scoped>

</style>
