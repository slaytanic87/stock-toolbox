<template>
<div class="container w-full mx-auto pt-3">
    <div class="bg-gray-900">
        <div class="flex mb-4 justify-center">
            <div class="ml-2 mt-0.5">
            <span class="block font-medium text-base leading-snug text-white text-xl">Watchlist</span>
            </div>
        </div>
        <watchlist @chartToCard="setChartData" @watchlistToCard="setWatchlistData"/>
    </div>
    <hr class="border-b-2 border-gray-600 my-8 mx-4">
    <div class="flex flex-row flex-wrap flex-grow mt-2">
        <windiagramcard v-bind:propData="chartData"></windiagramcard>
        <datacard v-bind:propChartData="watchlist"></datacard>
    </div>
</div>
</template>

<script>
import Watchlist from "./Watchlist.vue";
import WinDiagramCard from "./WinDiagramCard.vue";
import DataCard from "./DataCard.vue";
export default {
  name: "App",
  components: {
    "watchlist": Watchlist,
    "windiagramcard": WinDiagramCard,
    "datacard": DataCard
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
