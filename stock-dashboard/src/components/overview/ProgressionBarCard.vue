<template>
  <div class="w-full md:w-1/2 xl:w-1/3 p-3">
    <div class="bg-gray-900 border border-gray-800 rounded shadow">
      <div class="border-b border-gray-800 p-3">
        <h5 class="font-bold uppercase text-gray-600">
          Capital Progress
          <font-awesome-icon :icon="['fa', 'coins']" class="fa-fw mr-3"/>
        </h5>
      </div>
      <div class="relative pt-1">
        <div class="flex mb-2 items-center justify-between">
          <div>
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase text-indigo-600 ">
              {{currentAmount}}{{propCurrency}}
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold inline-block text-indigo-600">
              {{propTarget}}{{propCurrency}}
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
          <div :style="`width:${currentPercentage}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createWinLost, roundDigits } from "../../libs/utils.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCoins
} from "@fortawesome/free-solid-svg-icons";
library.add(faCoins);
export default {
  name: "ProgressionBarCard",
  props: {
    propTarget: {
      required: true
    },
    propChartData: {
      required: true
    },
    propCurrency: {
      required: false,
      default: "€"
    }
  },
  data() {
    return {
      currentPercentage: 0,
      currentAmount: 0
    }
  },
  watch: {
    propChartData: function (newValue) {
      let calcedData = createWinLost(newValue);
      let win = calcedData.win;
      let lost = calcedData.lost;
      let total = roundDigits(win + lost, 4);
      this.currentAmount = total;
      this.currentPercentage = total * 100 / this.propTarget;
    }
  }
}
</script>

<style scoped>

</style>
