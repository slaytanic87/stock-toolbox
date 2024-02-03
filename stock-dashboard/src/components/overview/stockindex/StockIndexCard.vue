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
      <div class="">
        <div class="bg-gray-800 k-line-index-chart-container" ref="indexCard">
          <Layout :title="this.indexName">
            <div :id="`chart-index-type-k-line-${this.id}`" class="k-line-chart"/>
            <div class="k-line-chart-menu-container"></div>
          </Layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { dispose, init } from 'klinecharts';
import { mapToKlineChartData } from "@/libs/klineChartDataMapper";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSync
} from "@fortawesome/free-solid-svg-icons";
import Layout from "@/components/overview/stockindex/Layout";
library.add(faSync);

export default {
  name: "StockIndex",
  props: {
    indexName: {
      required: true
    },
    chartData: {
      required: true,
      default: []
    },
    symbol: {
      required: true
    },
    id: {
      required: true
    }
  },
  components: {
    Layout
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
      dataCube: {},
      localChartData: [],
    }
  },
  destroyed() {
    dispose(`chart-index-type-k-line-${this.id}`);
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
        this.localChartData = mapToKlineChartData(response.data.chartData.chart);
      }).catch((err) => {
        console.error(err);
      });
    },
  },
  mounted() {
    this.setSize();
    this.localChartData = mapToKlineChartData(this.chartData);
    this.kLineChartIndex = init(`chart-index-type-k-line-${this.id}`,
        {
          grid: {
            horizontal: {
              show: true,
              size: 1,
              color: '#393939',
              // 'solid'|'dash'
              style: 'solid',
            },
            vertical: {
              show: true,
              size: 1,
              color: '#393939',
              // 'solid'|'dash'
              style: 'solid',
            }
          },
          candle: {
            type: 'candle_solid',
            tooltip: {
              showType: 'standard',
              showRule: 'always',
              labels: ['T：', 'O：', 'C：', 'H：', 'L：', 'V：']
            }
          }
        });
    this.kLineChartIndex.applyNewData(this.localChartData);
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
}
</script>

<style scoped>
.k-line-chart {
  display: flex;
  flex: 1;
}

.k-line-index-chart-container {
  display: flex;
  margin: 15px;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
  width: 690px;
  height: 700px;
}
</style>
