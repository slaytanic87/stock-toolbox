<template>
  <div>
    <div class="w-full flex justify-end px-2 mt-2">
      <div class="w-full sm:w-64 inline-block relative">
        <input v-model="search" @input="searchOnTable" placeholder="Search"
          class="leading-snug border border-gray-300 block w-full appearance-none bg-gray-100 text-sm text-gray-600 py-1 px-4 pl-8 rounded-lg"/>
      </div>
    </div>
    <table class="w-full table-auto">
      <thead class="justify-between">
        <tr class="bg-gray-800">
          <th class="px-16 py-2">
            <span class="text-gray-300">Name</span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300">Course</span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300">Entry</span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300">Win</span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300">Currency</span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300">RSI</span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in searched" :key="stock.name" class="bg-gray-750 border-4 lg:hover:bg-gray-600 border-gray-700">
          <td class="px-16 py-2 text-center">
            <span>
              {{ stock.name }}
            </span>
          </td>
          <td class="px-16 py-2 text-center">
            <span class="rounded-full bg-blue-500 py-1 px-3 text-xs font-bold">
              {{ stock.currentPrice }}
            </span>
          </td>
          <td class="px-16 py-2 text-center">
            <span class="rounded-full bg-yellow-600 py-1 px-3 text-xs font-bold">
              {{ stock.entryPrice }}
            </span>
          </td>
          <td class="px-16 py-2 text-center">
            <span v-if="stock.status === '-'" class="md-course-red py-1 px-3 text-xs font-bold">
              {{ stock.win }}
            </span>
            <span v-if="stock.status === '+'" class="md-course-green py-1 px-3 text-xs font-bold">
              {{ stock.win }}
            </span>
            <span v-if="stock.status === '='" class="py-1 px-3 text-xs font-bold">
              {{ stock.win }}
            </span>
          </td>
          <td class="px-16 py-2 text-center">
            <span>
              {{ stock.currency }}
            </span>
          </td>
          <td class="px-16 py-2 text-center">
            <span>
              {{ stock.rsi }}
            </span>
          </td>
          <td class="px-16 py-2">
            <button @click="showChart(stock.name, stock.chartData)"
              class="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">
              Chart
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <stock-chart
      v-bind:showDialog="showChartModal"
      v-bind:stockName="selectedName"
      v-bind:chartData="selectedChart"
      v-on:chartToDashMessage="closeDialog">
    </stock-chart>
  </div>
</template>

<script>
import axios from "axios";
import { createWatchItem, fetchStockData, mapChartDataFromResponse } from "../libs/yahooStockUtils.js";
import StockChart from "./StockChart.vue";
import { DataCube } from "trading-vue-js";
export default {
  name: "Watchlist",
  created() {
    this.fetchWatchList();
    this.pollingData();
  },
  components: {
    "stock-chart": StockChart,
  },
  data() {
    return {
      search: null,
      searched: [],
      stocks: [],
      interval: null,
      selectedChart: {},
      selectedName: "",
      showChartModal: false,
    };
  },
  methods: {
    fetchWatchList() {
      axios.get("http://localhost:9090/watchlist").then((res) => {
        this.clearData();
        let watchList = res.data;
        watchList.forEach((item) => {
          fetchStockData(item.name, "1mo").then((response) => {
            let watchItem = createWatchItem(item, response.data);
            this.stocks.push(watchItem);
            this.searched.push(watchItem);
          });
        });
      }).catch((error) => {
        console.log(error);
      });
    },
    toLower(text) {
      return text.toString().toLowerCase();
    },
    searchByName(items, term) {
      if (term) {
        return items.filter((item) =>
          this.toLower(item.name).includes(this.toLower(term))
        );
      }
      return items;
    },
    searchOnTable() {
      this.searched = this.searchByName(this.stocks, this.search);
    },
    clearData() {
      while (this.searched.length > 0) {
        this.searched.pop();
      }
      while (this.stocks.length > 0) {
        this.stocks.pop();
      }
    },
    pollingData() {
      this.interval = setInterval(this.fetchWatchList, 300000);
    },
    addStock() {
      // TODO
      console.log("Not implemented yet.");
    },
    showChart(chartName, chartData) {
      var self = this;
      fetchStockData(chartData.sym, "max").then((response) => {
          let watchItem = mapChartDataFromResponse(response.data);
          self.selectedChart = self.createDataCube(watchItem);
          self.selectedName = chartName;
          self.showChartModal = true;
      });
    },
    createDataCube(chartData) {
      let chartViewData = {
        chart: {
          type: "Candles",
          data: chartData.chart, // [timestamp, open, high, low, close, volume]
        },
        onchart: [{
          name: "Adjclose",
          type: "PlotOverlay",
          data: chartData.chartAdjclose, // [timestamp, adjclose]
          settings: {
            upper: 70,
            lower: 30,
            backColor: "#9b9ba316",
            bandColor: "#666",
          }
         }]
      };
      return new DataCube(chartViewData);
    },
    closeDialog(show) {
      this.showChartModal = show;
    }
  }
};
</script>

<style scoped>
.md-course-red {
  color: #f10b0b;
}
.md-course-green {
  color: #00f014;
}
.md-course-bg-blue {
  background-color: #448aff;
}
.md-course-bg-red {
  background-color: #f10b0b;
}
</style>
