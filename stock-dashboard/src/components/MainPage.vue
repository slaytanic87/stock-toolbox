<template>
  <div id="app">
    <nav class="bg-gray-900 fixed w-full z-10 top-0 shadow">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex-shrink-0 flex items-center">
              <img class="block lg:hidden h-9 w-auto"
                   src="../assets/stocks-icon-blue.png"
                   alt="Workflow"/>
              <img class="hidden lg:block h-9 w-auto"
                   src="../assets/stocks-icon-blue.png"
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
                <button @click="changeView('SocialMedia')">
                  <a href="#" v-bind:class="`block py-1 md:py-3 pl-1 align-middle no-underline hover:text-gray-100 border-b-2 hover:border-purple-400 ${socialMedia}`">
                    <span class="pb-1 md:pb-0 text-sm">Social Media</span>
                  </a>
                </button>
                <button @click="changeView('Calendar')">
                  <a href="#" v-bind:class="`block py-1 md:py-3 pl-1 align-middle no-underline hover:text-gray-100 border-b-2 hover:border-green-400 ${calendar}`">
                    <font-awesome-icon :icon="['fa', 'calendar-alt']" class="fa-fw mr-3"/>
                    <span class="pb-1 md:pb-0 text-sm">Calendar</span>
                  </a>
                </button>
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span class="sr-only">View notifications</span>
              <font-awesome-icon :icon="['fa', 'bell']" class="fa-fw m-1"/>
            </button>
            <button @click="logout()"
                    class="bg-gray-800 ml-2 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span class="sr-only">Sign out</span>
              <font-awesome-icon :icon="['fa', 'sign-out-alt']" class="fa-fw m-1"/>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <component v-bind:is="view"></component>
  </div>
</template>

<script>
import Overview from "@/components/overview/Overview.vue";
import News from "@/components/news/News.vue";
import Calendar from "@/components/calendar/Calendar";
import SocialMedia from "@/components/social_media/SocialMedia";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faHome,
  faEnvelope,
  faCalendarAlt,
  faSignOutAlt,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

library.add(faBars, faHome, faEnvelope, faCalendarAlt, faSignOutAlt, faBell);

export default {
  name: "MainPage",
  components: {
    Overview,
    News,
    Calendar,
    SocialMedia
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
    },
    calendar: function () {
      return this.$store.state.navigation.calendarBarCss;
    },
    socialMedia: function () {
      return this.$store.state.navigation.socialMediaBarCss;
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    changeView(viewName) {
      this.$store.commit("navigation/setView", viewName);
    },
    logout() {
      this.$cookies.remove("credentials");
      this.$store.commit("account/setView", "LoginPage");
    }
  }
}
</script>

<style scoped>

</style>