<template>
  <div class="w-full md:w-1/2 p-3">
    <div class="bg-gray-900 border border-gray-800 rounded shadow">
      <div class="border-b border-gray-800 p-3">
        <h5 class="font-bold uppercase text-gray-600">
          Heatmap Chart
          <font-awesome-icon :icon="['fa', 'chart-pie']"/>
        </h5>
      </div>
      <div class="p-5">
        <div ref="heatmapCard" class="bg-gray-800">
          <treemap
              :width="width"
              :height="width"
              :title-depth="2"
              :text-align="'center'"
              :text-vertical-align="'bottom'"
              :colors="['#259c19', '#EC2500']"
              :values="datasets">
            <note :text="'Stock Heatmap'" :align="'left'"></note>
            <tooltip :position="'top'"></tooltip> <!-- TODO not working, need some investigation -->
          </treemap>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Note from "./Note.js";
import Tooltip from "./Tooltip.js";
import Treemap from "./Treemap.js";
export default {
  name: "HeatmapCard",
  components: {
    treemap: Treemap,
    note: Note,
    tooltip: Tooltip
  },
  props: {
    datasets: {
      required: false
    }
  },
  data () {
    return {
      width: 600
    }
  },
  mounted () {
    this.setSize();
    window.addEventListener("resize", this.setSize);
  },
  beforeDestroy () {
    window.removeEventListener("resize", this.setSize);
  },
  methods: {
    setSize () {
      this.width = this.$refs.heatmapCard.clientWidth;
    }
  }
}
</script>

<style scoped>
</style>
