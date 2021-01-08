<template>
  <div>
   <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Watchlist</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state md-label="No stocks found" :md-description="`No stock found for this '${search}' query. Try a different search term or add a new stock.`">
        <md-button class="md-primary md-raised" @click="addStock()">Add Stock</md-button>
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" style="width:100%;">
          <md-table-cell md-label="Name" md-sort-by="name">
              {{item.name}}
          </md-table-cell>
          <md-table-cell md-label="Course" md-sort-by="currentPrice">
              <md-chip class="md-primary">
                {{item.currentPrice}}
              </md-chip>
          </md-table-cell>
          <md-table-cell md-label="Entry" md-sort-by="entryPrice">
            <md-chip>
              {{item.entryPrice}}
            </md-chip>
          </md-table-cell>
          <md-table-cell md-label="Win" md-sort-by="win">
            <div class="md-course-red" v-if="item.status === '-'">{{item.win}}</div>
            <div class="md-course-green" v-if="item.status === '+'">{{item.win}}</div>
            <div v-if="item.status === '='">{{item.win}}</div>
          </md-table-cell>
          <md-table-cell md-label="Currency" md-sort-by="currency">{{item.currency}}</md-table-cell>
          <md-table-cell>
              <md-button class="md-primary" @click="showChart(item.name, item.chartData)">Show</md-button>
          </md-table-cell>
      </md-table-row>
   </md-table>
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
      let path = "?formatted=true&lang=de-DE&region=DE&includeAdjustedClose=true&interval=1d&range=5y&corsDomain=de.finance.yahoo.com";
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
