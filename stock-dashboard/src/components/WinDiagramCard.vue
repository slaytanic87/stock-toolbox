<template>
  <div class="bg-gray-800">
      <piechart v-bind:propData="propData"></piechart>
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
