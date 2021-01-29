<template>
  <div>
    <div class="flex justify-end px-2 mt-2">
      <div class="sm:w-10 pb-2.5">
          <button @click="showAddStock()" class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <font-awesome-icon :icon="['fa', 'plus-circle']" class="fa-2x fa-fw fa-inverse"/>
          </button>
      </div>
      <div class=" sm:w-64 inline-block relative pb-2.5">
        <input v-model="search" @input="searchOnTable" placeholder="Search"
          class="leading-snug border border-gray-300 block w-full appearance-none text-sm bg-gray-900 text-sm text-gray-400 py-1 px-4 pl-8 rounded-lg"/>
      </div>
    </div>
    <table class="w-full table-auto">
      <thead class="justify-between">
        <tr class="bg-gray-800">
          <th class="py-2">
            <span class="text-gray-300">Stock</span>
          </th>
          <th class="py-2">
            <span class="text-gray-300">Course</span>
          </th>
          <th class="py-2">
            <span class="text-gray-300">Entry</span>
          </th>
          <th class="py-2">
            <span class="text-gray-300">Win</span>
          </th>
          <th class="py-2">
            <span class="text-gray-300">Quantity</span>
          </th>
          <th class="py-2">
            <span class="text-gray-300">RSI (14)</span>
          </th>
          <th class="py-2">
            <span class="text-gray-300">Mode</span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in searched" :key="stock.name" class="bg-gray-750 border-2 lg:hover:bg-blue-900 border-gray-700">
          <td class="py-2 text-center">
            <span>
              <font-awesome-icon :icon="['fa', 'industry']" class="fa-fw mr-3"/>
              {{ stock.name }}
            </span>
          </td>
          <td class="py-2 text-center">
            <span class="rounded-full bg-blue-500 py-1 px-3 text-xs font-bold">
              {{ stock.currentPrice }}
            </span>
          </td>
          <td class="py-2 text-center">
            <span class="rounded-full bg-yellow-600 py-1 px-3 text-xs font-bold">
              {{ stock.entryPrice }}
            </span>
          </td>
          <td class="py-2 text-center">
            <span v-if="stock.status === '-'" class="cus-course-red py-1 px-3 text-xs font-bold">
              {{ stock.win }}
            </span>
            <span v-if="stock.status === '+'" class="cus-course-green py-1 px-3 text-xs font-bold">
              {{ stock.win }}
            </span>
            <span v-if="stock.status === '='" class="py-1 px-3 text-xs font-bold">
              {{ stock.win }}
            </span>
          </td>
          <td class="py-2 text-center">
            <span>
              {{ stock.quantity }}
            </span>
          </td>
          <td class="py-2 text-center">
            <span>
              {{ stock.rsi }}
            </span>
          <td class="py-2 text-center">
            <span>
              <font-awesome-icon v-if="stock.observeOnly" :icon="['fas', 'eye']" class="fa-fw mr-3"/>
              <font-awesome-icon v-else :icon="['fas', 'money-bill-alt']" class="fa-fw mr-3"/>
            </span>
          </td>
          <td class="py-2 text-center">
            <button @click="showChart(stock.name, stock.chartData)"
              class="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">
              <font-awesome-icon :icon="['fa', 'chart-bar']" class="fa-fw mr-3"/>
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
      v-on:chartToDashMessage="closeChartDialog">
    </stock-chart>
    <stock-add-modal
      v-bind:showDialog="showAddStockModal"
      v-on:addChartModalToDashMessage="closeAddStockModal"
      >
    </stock-add-modal>
  </div>
</template>

<script>
import axios from "axios";
import { createWinPieDiagram } from "../../libs/utils.js";
import StockChart from "./StockChart.vue";
import StockAddModal from "./StockAddModal.vue";
import { DataCube } from "trading-vue-js";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEye,
  faMoneyBillAlt,
  faChartBar,
  faIndustry,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
library.add(faEye, faMoneyBillAlt, faChartBar, faIndustry, faPlusCircle);

export default {
  name: "Watchlist",
  created() {
    this.fetchWatchList();
    this.pollingData();
  },
  components: {
    "stock-chart": StockChart,
    "stock-add-modal": StockAddModal
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
      showAddStockModal: false
    };
  },
  watch: {
    stocks: function (val) {
        this.$emit("chartToCard", createWinPieDiagram(val));
        this.$emit("watchlistToCard", this.stocks);
    }
  },
  methods: {
    fetchWatchList() {
        let url = "/v2/watchlist";
        if (process.env.NODE_ENV === "development") {
          url = "http://localhost:9090/v2/watchlist";
        }
        axios.get(url).then((res) => {
        this.clearData();
        let watchList = res.data;
        this.stocks = watchList;
        this.searched = watchList;
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
      this.searched = [];
      this.stocks = []
    },
    pollingData() {
      this.interval = setInterval(this.fetchWatchList, 300000);
    },
    showChart(chartName, chartData) {
      var self = this;
      let url = "/stock";
      if (process.env.NODE_ENV === "development") {
          url = "http://localhost:9090/stock";
      }
      axios.post(url, {
        sym: chartData.sym,
        range: "max"
      }).then((response) => {
          self.selectedChart = self.createDataCube(response.data);
          self.selectedName = chartName;
          self.showChartModal = true;
      }).catch((error) => {
        console.log(error);
      })
    },
    showAddStock() {
      this.showAddStockModal = true;
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
    closeChartDialog(show) {
      this.showChartModal = show;
    },
    closeAddStockModal(show) {
      this.showAddStockModal = show;
    }
  }
};
</script>

<style scoped>
.cus-course-red {
  color: #f10b0b;
}
.cus-course-green {
  color: #00f014;
}
.cus-course-bg-blue {
  background-color: #448aff;
}
.cus-course-bg-red {
  background-color: #f10b0b;
}
</style>
