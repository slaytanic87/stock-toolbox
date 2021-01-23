<template>
  <div id="app">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex-shrink-0 flex items-center">
            <img class="block lg:hidden h-9 w-auto"
                 src="./assets/stocks-icon-blue.png"
                 alt="Workflow"/>
            <img class="hidden lg:block h-9 w-auto"
                 src="./assets/stocks-icon-blue.png"
                 alt="Workflow"/>
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <a href="#" class="bg-gray-900 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                 Watchlist
              </a>
              <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                 News
              </a>
              <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                 Projects
              </a>
              <a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                 Calendar
              </a>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span class="sr-only">View notifications</span>
            <!-- Heroicon name: bell -->
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="container w-full mx-auto">
    <div class="bg-gray-900">
          <div class="flex mb-4 justify-center">
            <div class="ml-2 mt-0.5">
              <span class="block font-medium text-base leading-snug text-white text-xl">Watchlist</span>
            </div>
          </div>
          <watchlist @chartToCard="setChartData" @watchlistToCard="setWatchlistData"/>
    </div>
    <hr class="border-b-2 border-gray-600 my-8 mx-4">
    <div class="flex flex-row flex-wrap flex-grow mt-2">
        <windiagramcard v-bind:propData="chartData"></windiagramcard>
        <datacard v-bind:propChartData="watchlist"></datacard>
    </div>
    </div>
  </div>
</template>

<script>
import Watchlist from "./components/Watchlist.vue";
import WinDiagramCard from "./components/WinDiagramCard.vue";
import DataCard from "./components/DataCard.vue";
export default {
  name: "App",
  components: {
    "watchlist": Watchlist,
    "windiagramcard": WinDiagramCard,
    "datacard": DataCard
  },
  data() {
    return {
      chartData: {},
      watchlist: []
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    setChartData(data) {
      this.chartData = data;
    },
    setWatchlistData(watchlistData) {
      this.watchlist = watchlistData;
    }
  }
};
</script>

<style lang="scss">
</style>
