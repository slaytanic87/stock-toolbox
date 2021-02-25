<template>
    <div class="w-full md:w-1/2 xl:w-1/3 space-y-2 pt-3">
        <div class="bg-gray-900 border border-gray-800 rounded shadow p-2">
            <div class="flex flex-row items-center">
                <div class="flex-shrink pr-4">
                    <div class="rounded p-3 bg-blue-600">
                    <!--
                    <i class="fas fa-server fa-2x fa-fw fa-inverse"></i> -->
                      <font-awesome-icon :icon="['fa', 'money-bill-alt']" class="fa-2x fa-fw fa-inverse"/>
                    </div>
                </div>
                <div class="flex-1 text-right md:text-center">
                    <h5 class="font-bold uppercase text-gray-400">Invested Capital</h5>
                    <h3 class="font-bold text-3xl text-gray-500">{{ invested }}</h3>
                </div>
            </div>
        </div>
        <!--Metric Card-->
        <div class="bg-gray-900 border border-gray-800 rounded shadow p-2">
            <div class="flex flex-row items-center">
                <div class="flex-shrink pr-4">
                    <div class="rounded p-3 bg-green-600">
                      <font-awesome-icon :icon="['fa', 'arrow-circle-up']" class="fa-2x fa-fw fa-inverse"/>
                    </div>
                </div>
                <div class="flex-1 text-right md:text-center">
                    <h5 class="font-bold uppercase text-gray-400">
                      Win
                      <font-awesome-icon :icon="['fa', 'heart']" class="fa-fw mr-3"/>
                    </h5>
                    <h3 v-if="win > 0" class="font-bold text-3xl text-green-500">{{ win }}
                      <span class="text-green-500"><font-awesome-icon :icon="['fa', 'caret-up']" /></span>
                    </h3>
                    <h3 v-else class="font-bold text-3xl text-gray-600">{{ win }}</h3>
                </div>
            </div>
        </div>
        <!--/Metric Card-->
        <!--Metric Card-->
        <div class="bg-gray-900 border border-gray-800 rounded shadow p-2">
            <div class="flex flex-row items-center">
                <div class="flex-shrink pr-4">
                    <div class="rounded p-3 bg-red-600">
                      <font-awesome-icon :icon="['fa', 'arrow-circle-down']" class="fa-2x fa-fw fa-inverse"/>
                    </div>
                </div>
                <div class="flex-1 text-right md:text-center">
                    <h5 class="font-bold uppercase text-gray-400">
                      Lost
                      <font-awesome-icon :icon="['fa', 'bolt']" class="fa-fw mr-3"/>
                    </h5>
                    <h3 v-if="lost < 0" class="font-bold text-3xl text-red-700">{{ lost }}
                      <span class="text-red-500"><font-awesome-icon :icon="['fa', 'caret-down']" /></span>
                    </h3>
                    <h3 v-else class="font-bold text-3xl text-gray-600">{{ lost }}</h3>

                </div>
            </div>
        </div>
        <!--/Metric Card-->
        <div class="bg-gray-900 border border-gray-800 rounded shadow p-2">
            <div class="flex flex-row items-center">
                <div class="flex-shrink pr-4">
                    <div class="rounded p-3 bg-yellow-600">
                      <font-awesome-icon :icon="['fa', 'university']" class="fa-2x fa-fw fa-inverse"/>
                    </div>
                </div>
                <div class="flex-1 text-right md:text-center">
                    <h5 class="font-bold uppercase text-gray-400">Total</h5>
                    <h3 v-if="total < 0" class="font-bold text-3xl text-red-700">{{ total }}</h3>
                    <h3 v-else-if="total > 0" class="font-bold text-3xl text-green-500">{{ total }}</h3>
                    <h3 v-else class="font-bold text-3xl text-gray-500">{{ total }}</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createWinLost, roundDigits } from "../../../libs/utils.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUniversity,
  faMoneyBillAlt,
  faArrowCircleUp,
  faArrowCircleDown,
  faBolt,
  faHeart,
  faCaretUp,
  faCaretDown
} from "@fortawesome/free-solid-svg-icons";
library.add(faUniversity, faMoneyBillAlt, faArrowCircleUp, faArrowCircleDown, faBolt, faHeart,
faCaretUp, faCaretDown);
export default {
  name: "App",
  components: {

  },
  props: {
      propChartData: {
          required: true
      }
  },
  watch: {
      propChartData: function (newVal) {
          let calcedData = createWinLost(newVal);
          this.invested = calcedData.invested;
          this.win = calcedData.win;
          this.lost = calcedData.lost;
          this.total = roundDigits(this.win + this.lost, 4);
      }
  },
  data() {
    return {
      win: 0,
      lost: 0,
      total: 0,
      invested: 0
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style lang="scss">
</style>
