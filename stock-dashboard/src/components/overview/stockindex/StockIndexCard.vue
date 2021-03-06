<template>
  <div class="w-full md:w-1/2 xl:w-1/2 p-3">
    <div class="bg-gray-900 border border-gray-800 rounded shadow">
      <div class="border-b border-gray-800 p-3">
        <h5 class="font-bold uppercase text-gray-600">
          {{indexName}} ({{symbol}})
          <button @click="syncData()" class="rounded-full">
            <font-awesome-icon :icon="['fa', 'sync']" class="fa-fw fa-inverse"/>
          </button>
        </h5>
      </div>
      <div class="p-3">
        <div class="bg-gray-800" ref="indexCard">

          <trading-vue :title-txt="indexName"
                       :toolbar="false"
                       :chart-config="config"
                       :data="dataCube"
                       :width="width"
                       :height="height"></trading-vue>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import { DataCube } from "trading-vue-js";
import { TradingVue } from "trading-vue-js";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSync
} from "@fortawesome/free-solid-svg-icons";
library.add(faSync);

export default {
  name: "StockIndex",
  props: {
    indexName: {
      required: true
    },
    chartData: {
      required: true,
      default: {}
    },
    symbol: {
      required: true
    }
  },
  components: {
    "trading-vue": TradingVue
  },
  data () {
    return {
      height: 400,
      width: 700,
      config: {
        DEFAULT_LEN: 200,
        TB_BORDER: 3,
        CANDLEW: 1,
        GRIDX: 100,
        VOLSCALE: 1.0
      },
      dataCube: {}
    }
  },
  methods: {
    setSize () {
      this.height = this.$refs.indexCard.clientHeight;
      this.width = this.$refs.indexCard.clientWidth;
    },
    onResize() {
      this.setSize();
    },
    async syncData() {
      let url = "/marketIndex";
      if (process.env.NODE_ENV === "development") {
        url = "http://localhost:9090/marketIndex";
      }

      axios.post(url, {
        symbol: this.symbol
      }).then((response) => {
        this.dataCube = this.createDataCube(response.data.chartData);
      }).catch((err) => {
        console.log(err);
      });
    },
    createDataCube(chartData) {
      let chartViewData = {
        chart: {
          type: "Candles",
          data: chartData.chart, // [timestamp, open, high, low, close, volume]
        }
      };
      return new DataCube(chartViewData);
    }
  },
  mounted() {
    this.setSize();
    this.dataCube = this.chartData;
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
}
</script>

<style scoped>

</style>
