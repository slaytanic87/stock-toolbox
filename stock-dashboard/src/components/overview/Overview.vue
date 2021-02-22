<template>
<div class="container w-full mx-auto pt-20">
  <div class="bg-gray-900">
        <div class="flex mb-4 justify-center">
            <div class="ml-2 mt-0.5">
            <span class="block font-medium text-base leading-snug text-white text-xl">
              <font-awesome-icon :icon="['fa', 'binoculars']" class="fa-fw mr-3"/>
              Watchlist
            </span>
            </div>
        </div>
        <watchlist @chartToCard="setChartData" @watchlistToCard="setWatchlistData"/>
  </div>
  <hr class="border-b-2 border-gray-600 my-8 mx-4">
  <div class="flex flex-row flex-wrap flex-grow mt-2">
    <location-card v-bind:propWatchList="watchlist"></location-card>
    <datacard v-bind:propChartData="watchlist"></datacard>
    <windiagramcard v-bind:propData="chartData"></windiagramcard>
    <progression-bar-card v-bind:propChartData="watchlist"
                          v-bind:propTargetStep="2000"></progression-bar-card>

  </div>
</div>
</template>

<script>
import Watchlist from "./watchlist/Watchlist.vue";
import WinDiagramCard from "./windiagram/WinDiagramCard.vue";
import DataCard from "./data/DataCard.vue";
import ProgressionBarCard from "@/components/overview/progression/ProgressionBarCard";
import LocationCard from "@/components/overview/map/LocationCard";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBinoculars
} from "@fortawesome/free-solid-svg-icons";
library.add(faBinoculars);

export default {
  name: "App",
  components: {
    "watchlist": Watchlist,
    "windiagramcard": WinDiagramCard,
    "datacard": DataCard,
    "progression-bar-card": ProgressionBarCard,
    "location-card": LocationCard
  },
  data() {
    return {
      chartData: {},
      watchlist: []
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    setChartData(data) {
      this.chartData = data;
    },
    setWatchlistData(watchlistData) {
      this.watchlist = watchlistData;
    }
  }
};
</script>

<style lang="scss">
</style>
