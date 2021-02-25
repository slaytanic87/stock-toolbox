<template>
  <div>
    <div v-if="showDialog"
      class="overflow-x-hidden pt-12 overflow-y-auto fixed inset-0 outline-none focus:outline-none items-center flex">
      <div class="relative w-auto my-6 mx-auto max-w-6xl">
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-600 outline-none focus:outline-none">
          <div class="p-1 flex-auto">
            <trading-vue
              :title-txt="stockName"
              :toolbar="true"
              :data="chartData"
              :overlays="overlays"
              :width="1100"
              :height="650"
            ></trading-vue>
          </div>
          <div class="flex items-center justify-end p-2 border-t border-solid border-gray-300 rounded-b">
            <button @click="closeModal()" class="bg-indigo-500 text-white px-2 py-2 border rounded-md hover:bg-white hover:border-indigo-500 hover:text-black">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TradingVue } from "trading-vue-js";
import PlotOverlay from "./PlotOverlay.vue";
export default {
  name: "StockChart",
  created() {},
  components: {
    "trading-vue": TradingVue
  },
  updated() {},
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      overlays: [PlotOverlay],
    };
  },
  methods: {
    closeModal() {
      this.showDialog = false;
      this.$emit("chartToDashMessage", this.showDialog);
    },
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
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
      default: false,
    },
  },
};
</script>

<style>

</style>
