<template>
  <div class="w-full md:w-1/2 p-3">
    <!--Graph Card-->
    <div class="bg-gray-900 border border-gray-800 rounded shadow">
        <div class="border-b border-gray-800 p-3">
            <h5 class="font-bold uppercase text-gray-600">Win Pie Chart</h5>
        </div>
        <div class="p-5">
          <div class="bg-gray-800">
              <piechart v-bind:propData="propData"></piechart>
          </div>
        </div>
    </div>
    <!--/Graph Card-->
  </div>
</template>

<script>
import PieChart from "./PieChart.js";
export default {
  name: "WinDiagramCard",
  components: {
      piechart: PieChart
  },
  props: {
      propData: {
          required: true,
      }
  },
  created() {},
};
</script>

<style lang="scss">
</style>
