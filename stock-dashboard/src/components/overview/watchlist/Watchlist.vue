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
            <span class="text-gray-300">Shares</span>
          </th>
          <th class="py-2">
            <span class="text-gray-300">RSI (14)</span>
          </th>
          <th class="py-2">
            <span class="text-gray-300">Mode</span>
          </th>
          <th class="py-2">
            <span class="text-gray-300">Edit</span>
          </th>
          <th class="py-2">
            <span class="text-gray-300">Remove</span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in filteredBySearch" :key="stock.name" class="bg-gray-750 border-2 lg:hover:bg-blue-900 border-gray-700">
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
              <font-awesome-icon v-if="stock.observeOnly" :icon="['fas', 'eye']" class="fa-fw mr-3 cus-course-light-blue"/>
              <font-awesome-icon v-else :icon="['fas', 'money-bill-alt']" class="fa-fw mr-3 cus-course-dark-green"/>
            </span>
          </td>
          <td class="py-2 text-center">
            <button @click="openEditStock(stock)">
              <font-awesome-icon :icon="['fa', 'edit']" class="fa-fw cus-course-light-blue"/>
            </button>
          </td>
          <td class="py-2 text-center">
            <button @click="removeStock(stock)">
              <font-awesome-icon :icon="['fa', 'trash-alt']" class="fa-fw cus-course-red"/>
            </button>
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
    <stock-chart-kline
        v-bind:showDialog="showChartModal"
        v-bind:stockName="selectedName"
        v-bind:chartData="selectedChart"
        v-on:chartToDashMessage="closeChartDialog">
    </stock-chart-kline>
    <stock-add-modal
        v-bind:showDialog="showAddStockModal"
        v-on:messageFromAddChartModalToDash="closeAddStockModal">
    </stock-add-modal>
    <stock-edit-modal
        v-bind:stock="selectedStock"
        v-bind:showDialog="showEditStockModal"
        v-on:messageFromEditChartModalToDash="closeEditStockModal">
    </stock-edit-modal>
  </div>
</template>

<script>
import axios from "axios";
import StockChartKline from "@/components/overview/chartmodal/StockChartKline";
import AddStockModal from "./AddStockModal.vue";
import EditStockModal from "@/components/overview/watchlist/EditStockModal";
import { DataCube } from "trading-vue-js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { mapToKlineChartData } from "@/libs/klineChartDataMapper";
import {
  faEye,
  faMoneyBillAlt,
  faChartBar,
  faIndustry,
  faPlusCircle,
  faTrashAlt,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
library.add(faEye, faMoneyBillAlt, faChartBar, faIndustry, faPlusCircle, faTrashAlt, faEdit);

export default {
  name: "Watchlist",
  created() {
    this.fetchWatchList();
    this.pollingData();
  },
  components: {
    "stock-add-modal": AddStockModal,
    "stock-edit-modal": EditStockModal,
    "stock-chart-kline": StockChartKline
  },
  data() {
    return {
      search: null,
      filteredBySearch: [],
      stocks: [],
      interval: null,
      selectedChart: null,
      selectedName: "",
      selectedStock: null,
      showChartModal: false,
      showAddStockModal: false,
      showEditStockModal: false
    }
  },
  watch: {
    stocks: function (val) {
        this.$emit("chartToCard", val);
        this.$emit("watchlistToCard", this.filteredBySearch);
    }
  },
  methods: {
    fetchWatchList () {
      let url = "/v2/watchlist";
      if (process.env.NODE_ENV === "development") {
        url = "http://localhost:9090/v2/watchlist";
      }
      let user = this.$cookies.get("credentials");
      axios.post(url, user).then((res) => {
          let watchList = res.data;
          if (this.stocks.length === 0) {
            this.stocks = watchList;
          } else {
            for (let posCurrentStock = 0; posCurrentStock < this.stocks.length; posCurrentStock++) {
              let currentStock = this.stocks[posCurrentStock];
              for (let posFetchedStock = posCurrentStock; posFetchedStock < watchList.length; posFetchedStock++) {
                let stockNew = watchList[posFetchedStock];
                if (currentStock.name === stockNew.name && currentStock.observeOnly === stockNew.observeOnly) {
                  this.stocks[posCurrentStock] = stockNew;
                  break;
                }
              }
            }
          }
          this.filteredBySearch = this.stocks;
      }).catch((error) => {
        console.error(error);
      });
    },
    fetchWatchedStock(symbol) {
      let self = this;
      let url = "/watchedStock";
      if (process.env.NODE_ENV === "development") {
        url = `http://localhost:9090${url}`;
      }
      axios.post(url, {
        symbol: symbol,
        user: this.$cookies.get("credentials")
      }).then((res) => {
        self.selectedStock = res.data;
        self.showEditStockModal = true;
        console.debug(res.status);
      }).catch((error) => {
        console.error(error);
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
      this.filteredBySearch = this.searchByName(this.stocks, this.search);
    },
    pollingData() {
      this.interval = setInterval(this.fetchWatchList, 300000);
    },
    showChart(chartName, chartData) {
      var self = this;
      let url = "/stock";
      if (process.env.NODE_ENV === "development") {
          url = "http://localhost:9090" + url;
      }
      axios.post(url, {
        sym: chartData.sym,
        range: "3y"
      }).then((response) => {
          self.selectedChart = mapToKlineChartData(response.data.chart); //self.createDataCube(response.data);
          self.selectedName = chartName;
          self.showChartModal = true;
      }).catch((error) => {
        console.error(error);
      })
    },
    openEditStock(stock) {
      this.fetchWatchedStock(stock.sym);
    },
    removeStock(stock) {
      let url = "/removeStock";
      if (process.env.NODE_ENV === "development") {
        url = "http://localhost:9090" + url;
      }
      axios.patch(url, {
        stock: stock,
        user: this.$cookies.get("credentials")
      }).then(() => {
        let indexToBeRemoved = -1;
        for (let i = 0; i < this.stocks.length; i++) {
          let stockObj = this.stocks[i];
          if (stockObj.sym === stock.sym) {
            indexToBeRemoved = i;
            break;
          }
        }
        if (indexToBeRemoved < 0) {
          return;
        }
        this.stocks.splice(indexToBeRemoved, 1);
        this.filteredBySearch = this.stocks;
      }).catch((error) => {
        console.error(error);
      })
    },
    showAddStock() {
      this.showAddStockModal = true;
    },
    createDataCube(chartData) {
      let chartViewData = {
        chart: {
          type: "Candles",
          data: chartData.chart, // [[timestamp, open, high, low, close, volume]]
        },
        onchart: [{
          name: "SMA, 100",
          type: "PlotOverlay",
          data: chartData.sma100, // [[timestamp, adjclose]]
          settings: {
            upper: 70,
            lower: 30,
            backColor: "#e5ec09",
            bandColor: "#666"
          }
         },
         {
           name: "SMA, 30",
           type: "PlotOverlay",
           data: chartData.sma30,
           settings: {
             upper: 70,
             lower: 30,
             backColor: "#9b9ba316",
             bandColor: "#666"
           }
         }],
        offchart: [
          {
            name: "RSI, 14",
            type: "RSI",
            data: chartData.rsi14,
            settings: {
              upper: 70,
              lower: 30
            }
          },
          {
            name: "MACD Signal, 12/26/9",
            type: "Splines",
            data: chartData.macd, // [[timestamp, macd, signal]]
            settings: {
              upper: 70,
              lower: 30
            }
          }
        ]
      };
      return new DataCube(chartViewData);
    },
    closeChartDialog (show) {
      this.showChartModal = show;
    },
    closeAddStockModal (show) {
      this.showAddStockModal = show;
    },
    closeEditStockModal (show) {
      this.showEditStockModal = show;
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
.cus-course-light-blue {
  color: #80b0ef;
}

.cus-course-dark-green {
  color: #0f7a18;
}

.cus-course-bg-red {
  background-color: #f10b0b;
}
</style>
