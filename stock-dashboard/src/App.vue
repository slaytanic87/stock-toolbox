<template>
  <div id="app">
   <nav class="bg-gray-900 fixed w-full z-10 top-0 shadow"> 
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
              <button @click="changeView('Overview')">
                <a href="#" v-bind:class="`block py-1 md:py-3 pl-1 align-middle no-underline hover:text-gray-100 border-b-2 hover:border-blue-400 ${overview}`">
                  <font-awesome-icon :icon="['fas', 'home']" class="fa-fw mr-3"/>
                  <span class="pb-1 md:pb-0 text-sm">Overview</span>
                </a>
              </button>
              <button @click="changeView('News')">
                <a href="#" v-bind:class="`block py-1 md:py-3 pl-1 align-middle no-underline hover:text-gray-100 border-b-2 hover:border-pink-400 ${news}`">
                <font-awesome-icon :icon="['fa', 'envelope']" class="fa-fw mr-3"/>
                  <span class="pb-1 md:pb-0 text-sm">News</span>
                </a>
              </button>
              <button>
                <a href="#" class="block py-1 md:py-3 pl-1 align-middle no-underline hover:text-gray-100 border-b-2 hover:border-purple-400 text-gray-500 border-gray-900">
                  <span class="pb-1 md:pb-0 text-sm">Projects</span>
                </a>
              </button>
              <button>
                <a href="#" class="block py-1 md:py-3 pl-1 align-middle no-underline hover:text-gray-100 border-b-2 hover:border-green-400 text-gray-500 border-gray-900">
                  <span class="pb-1 md:pb-0 text-sm">Calendar</span>
                </a>
              </button>
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
   </nav>
    <component v-bind:is="view"></component>
</div>
</template>

<script>
import Overview from "./components/overview/Overview.vue";
import News from "./components/news/News.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faHome,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

library.add(faBars, faHome, faEnvelope);

export default {
  name: "App",
  components: {
    Overview,
    News
  },
  data() {
    return {
    }
  },
  computed: {
    view: function () {
        return this.$store.state.navigation.view;
    },
    overview: function () {
       return this.$store.state.navigation.overviewBarCss;
    },
    news: function () {
      return this.$store.state.navigation.newsBarCss;
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    changeView(viewName) {
      this.$store.commit("navigation/setView", viewName);
    }
  }
};
</script>

<style lang="scss">
</style>
