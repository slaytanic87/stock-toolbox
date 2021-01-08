<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-content>
            <trading-vue :title-txt="stockName" 
                         :toolbar="true" 
                         :data="chartViewData" 
                         :width="this.width - 100" 
                         :height="this.height - 120"
                         :overlays="overlays"></trading-vue>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeModal()">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import {TradingVue} from 'trading-vue-js'
import CustomOverlay from "./CustomOverlay.vue";
export default {
  name: 'StockChart',
  created () {
  },
  components: { 
    "trading-vue": TradingVue 
  },
  updated () {
    let ohlcvArray = [];
    let timestamps = this.chartData.timestamp;

    for (let i = 0; i < timestamps.length; i++) {
      let timestamp = timestamps[i];
      let close = this.chartData.chart.close[i];
      let open = this.chartData.chart.open[i];
      let high = this.chartData.chart.high[i];
      let low = this.chartData.chart.low[i];
      let volume = this.chartData.chart.low[i];
      let chartVector = [timestamp, open, high, low, close, volume];
      ohlcvArray.push(chartVector);
    }
    this.chartViewData.chart.data = ohlcvArray;
  },
  mounted() {
        window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
  },
  data () {
        return {
            // [timestamp, open, high, low, close, volume]
            chartViewData: { 
              chart: {
                type: "Candles",
                data: []
              }
            },
            overlays: [CustomOverlay],
            width: window.innerWidth,
            height: window.innerHeight
        }
  },
  methods: {
    closeModal() {
      this.showDialog = false;
      this.$emit('chartToDashMessage', this.showDialog)
    },
    onResize() {
            this.width = window.innerWidth
            this.height = window.innerHeight
    }
  },
  props: {
    stockName: { 
      type: String,
      default: "N/A",
      required: true
    },
    chartData: {
      required: true,
      default: {}
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style >
.md-dialog .md-dialog-container {
    max-width: 100%;
    max-height: 100%;
 }
</style>
