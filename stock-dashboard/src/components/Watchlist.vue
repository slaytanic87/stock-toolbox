<template>
  <div>
    <table class="min-w-full table-auto">
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
              <span class="text-gray-300">Show</span>
            </th>
          </tr>
      </thead>
      <tbody>
        <tr v-for="stock in searched" :key="stock.name" class="bg-white border-4 border-gray-200">
          <td class="px-16 py-2">
            <span>
              {{stock.name}}
            </span>
          </td>
          <td class="px-16 py-2">
            <span class="rounded bg-blue-400 py-1 px-3 text-xs font-bold">
              {{stock.currentPrice}}
            </span>
          </td>
          <td class="px-16 py-2">
            <span class="rounded bg-yellow-400 py-1 px-3 text-xs font-bold">
              {{stock.entryPrice}}
            </span>
          </td>
          <td class="px-16 py-2">
            <span v-if="stock.status === '-'" class="rounded bg-red-400 py-1 px-3 text-xs font-bold">
              {{stock.win}}
            </span>
            <span v-if="stock.status === '+'" class="rounded bg-green-400 py-1 px-3 text-xs font-bold">
              {{stock.win}}
            </span>
            <span v-if="stock.status === '='" class="rounded py-1 px-3 text-xs font-bold">
              {{stock.win}}
            </span>
          </td>
          <td class="px-16 py-2">
            <span>
              {{stock.currency}}
            </span>
          </td>
          <td class="px-16 py-2">
              <button 
                @click="showChart(stock.name, stock.chartData)"
                class="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">
                Chart
              </button>
          </td>
        </tr>
      </tbody>
   </table>
   <stock-chart v-bind:showDialog="showChartModal" 
                v-bind:stockName="selectedName"
                v-bind:chartData="selectedChart"
                v-on:chartToDashMessage="closeDialog">
   </stock-chart>
  </div>
</template>

<script>

import axios from "axios";
import { createWatchItem } from "../libs/stockUtils.js";
import StockChart from "./StockChart.vue";
export default {
  name: 'Watchlist',
  created () {
    this.fetchWatchList();
    this.pollingData();
  },
  components: {
    "stock-chart": StockChart
  },
  data () {
      return {
        search: null,
        searched: [],
        stocks: [],
        interval: null,
        selectedChart: {},
        selectedName: "",
        showChartModal: false
      }
  },
  methods: {
    fetchStockData (symbol) {
      let baseUrl = "https://query1.finance.yahoo.com/v8/finance/chart/";
      let path = "?formatted=true&lang=de-DE&region=DE&includeAdjustedClose=true&interval=1d&range=max&corsDomain=de.finance.yahoo.com";
      let data = {
        url: baseUrl + symbol + path
      };
      return axios.post("http://localhost:9090/", data)
    },
    fetchWatchList() {
        this.clearData();
        axios.get("http://localhost:9090/watchlist")
        .then((res) => {
          let watchList = res.data;
          watchList.forEach(item => { 
              this.fetchStockData(item.name).then(response => {
                let watchItem = createWatchItem(item, response.data);
                this.stocks.push(watchItem);
                this.searched.push(watchItem);
              })
          })
        }).catch((error) => {
          console.log(error);
        });
    },
    toLower(text) {
      return text.toString().toLowerCase();
    },
    searchByName(items, term) {
      if (term) {
        return items.filter(item => this.toLower(item.name).includes(this.toLower(term)))
      }
      return items;
    },
    searchOnTable () {
        this.searched = this.searchByName(this.stocks, this.search)
    },
    clearData() {
      while(this.searched.length > 0) {
        this.searched.pop();
      }
      while(this.stocks.length > 0) {
        this.stocks.pop();
      }
    },
    pollingData () {
        this.interval = setInterval(this.fetchWatchList, 300000);
    },
    addStock () {
      // TODO 
      console.log("Not implemented yet.");
    },
    showChart(chartName, chartData) {
      this.selectedName = chartName;
      this.showChartModal = true;
      this.selectedChart = chartData;
    },
    closeDialog (show) {
      this.showChartModal = show;
    }
  }
}
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
