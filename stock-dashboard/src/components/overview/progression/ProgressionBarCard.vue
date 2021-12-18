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
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase text-indigo-400 ">
              {{currentAmount}}{{propCurrency}}
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold inline-block text-indigo-400">
              {{currentTarget}}{{propCurrency}}
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
          <div :style="`width:${currentPercentage}%`" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
        </div>
      </div>
      <table class="rounded-t-lg m-5 w-5/6 mx-auto bg-gray-600 text-gray-200">
        <tr>
          <th>Milestones</th>
        </tr>
        <tr v-for="(item) in milestonesList" :key="item" :style='{ backgroundColor: `rgb(${color()}, ${color()}, ${color()})` }'
            class="border-b border-gray-600">
          <td class="px-4 py-3 lg:hover:bg-indigo-600 text-center">
              {{item}}{{propCurrency}}
              <font-awesome-icon :icon="['fa', 'check']" class="rounded bg-green-500"/>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { createWinLost, roundDigits } from "../../../libs/utils.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCoins,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
library.add(faCoins, faCheck);
export default {
  name: "ProgressionBarCard",
  props: {
    propTargetStep: {
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
      currentAmount: 0,
      currentTarget: 0,
      targetFactor: 2,
      milestonesList: []
    }
  },
  computed: {
  },
  watch: {
    propChartData: function (newValue) {
      let calcedData = createWinLost(newValue);
      let win = calcedData.win;
      let lost = calcedData.lost;
      let total = roundDigits(win + lost, 4);
      this.currentAmount = total;

      while (this.currentAmount > this.currentTarget) {
        this.currentTarget += this.targetFactor * this.propTargetStep;
        if (this.currentAmount >= this.currentTarget) {
          this.milestonesList.push(this.currentTarget);
        }
      }
      this.milestonesList = this.milestonesList.reverse();
      this.currentPercentage = total * 100 / this.currentTarget;
    }
  },
  methods: {
    color () {
      return Math.floor(Math.random() * 210);
    }
  }
}
</script>

<style scoped>

</style>
