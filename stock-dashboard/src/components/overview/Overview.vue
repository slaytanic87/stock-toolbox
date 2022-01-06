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
    <stock-index-card v-for="stockindex in indexList" :key="stockindex.symbol"
                      v-bind:indexName="stockindex.name"
                      v-bind:symbol="stockindex.symbol"
                      v-bind:chartData="stockindex.chartDataCube"></stock-index-card>
    <heatmap-card v-bind:datasets="treemapData"></heatmap-card>
  </div>
</div>
</template>

<script>
import axios from "axios";
import Watchlist from "./watchlist/Watchlist.vue";
import WinDiagramCard from "./windiagram/WinDiagramCard.vue";
import DataCard from "./data/DataCard.vue";
import ProgressionBarCard from "@/components/overview/progression/ProgressionBarCard";
import LocationCard from "@/components/overview/map/LocationCard";
import StockIndexCard from "@/components/overview/stockindex/StockIndexCard";
import HeatmapCard from "@/components/overview/treemapchart/HeatmapCard";

import { createWinPieDiagram, createStatusTreemapDataList } from "../../libs/utils.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBinoculars,
  faSignal
} from "@fortawesome/free-solid-svg-icons";
import { DataCube } from "trading-vue-js";
library.add(faBinoculars, faSignal);

export default {
  name: "App",
  components: {
    "watchlist": Watchlist,
    "windiagramcard": WinDiagramCard,
    "datacard": DataCard,
    "progression-bar-card": ProgressionBarCard,
    "location-card": LocationCard,
    "stock-index-card": StockIndexCard,
    "heatmap-card": HeatmapCard
  },
  data() {
    return {
      chartData: {},
      watchlist: [],
      indexList: [],
      treemapData: []
    }
  },
  created() {
  },
  mounted() {
    this.fetchChartIndices();
  },
  methods: {
    setChartData (data) {
      this.chartData = createWinPieDiagram(data);
      this.treemapData = createStatusTreemapDataList(data);
    },
    setWatchlistData (watchlistData) {
      this.watchlist = watchlistData;
    },
    async fetchChartIndices () {
      let url = "/indexlist";
      if (process.env.NODE_ENV === "development") {
        url = `http://localhost:9090${url}`;
      }
      let user = this.$cookies.get("credentials");
      axios.post(url, user).then((res) => {
        let list = res.data;
        this.indexList = [];
        list.forEach((data) => {
          this.indexList.push({
            symbol: data.symbol,
            name: data.name,
            chartDataCube: this.createDataCube(data.chartData)
          });
        });
      }).catch((error) => {
        console.error(error);
      });
    },
    createDataCube (chartData) {
      let chartViewData = {
        chart: {
          type: "Candles",
          data: chartData.chart, // [timestamp, open, high, low, close, volume]
        }
      };
      return new DataCube(chartViewData);
    }
  }
};
</script>

<style lang="scss">
</style>
