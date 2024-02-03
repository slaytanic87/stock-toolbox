<template>
  <div class="modal-chart">
    <modal v-if="showDialog"
         class="overflow-x-hidden pt-8 overflow-y-auto fixed inset-0 outline-none focus:outline-none items-center flex">
      <div class="relative w-auto my-6 mx-auto max-w-6xl">
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-600 outline-none focus:outline-none">
          <div class="p-1 flex-auto">
            <Layout :title="stockName">
              <div id="chart-type-k-line" class="k-line-chart"/>
              <div class="k-line-chart-menu-container"></div>
            </Layout>
          </div>
          <div class="k-line-chart-menu-container flex items-center justify-end p-4 border-t border-solid border-gray-300 rounded-b">
            <button @click="closeModal()">
              Close
            </button>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { dispose, init } from 'klinecharts';
import Layout from "@/components/overview/chartmodal/Layout";
export default {
  name: "StockChartKline",
  components: { Layout },
  props: {
    stockName: {
      type: String,
      default: "N/A",
      required: true
    },
    chartData: {
      required: true,
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  watch: {
    showDialog() {
        this.$nextTick(function () {
          this.kLineChart = init("chart-type-k-line");
          if (!this.kLineChart) {
            return;
          }
          this.kLineChart.setStyleOptions({
            candle: {
              tooltip: {
                showType: 'standard',
                showRule: 'always',
                labels: ['T：', 'O：', 'C：', 'H：', 'L：', 'V：']
              }
            },
            technicalIndicator: {
              tooltip: {
                showRule: 'always'
              }
            },
          })
          this.kLineChart.createTechnicalIndicator('EMA', false, { id: 'candle_pane' })
          this.kLineChart.createTechnicalIndicator('MACD', false, { height: 80 })
          this.kLineChart.applyNewData(this.chartData);
        })
    }
  },
  mounted() {
  },
  destroyed() {
    dispose('chart-type-k-line');
  },
  methods: {
    closeModal() {
      this.showDialog = false;
      this.$emit("chartToDashMessage", this.showDialog);
    },
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }
  }
}
</script>

<style scoped>
.k-line-chart {
  display: flex;
  flex: 1;
}

.k-line-chart-menu-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
  color: #606060;
}
.k-line-chart-menu-container button {
  cursor: pointer;
  background-color: #2196F3;
  border-radius: 2px;
  margin-right: 8px;
  height: 24px;
  line-height: 26px;
  padding: 0 6px;
  font-size: 12px;
  color: #fff;
  border: none;
  outline: none;
}
</style>
