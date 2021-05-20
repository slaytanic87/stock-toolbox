<template>
  <div id="app">
    <component v-bind:is="view"></component>
</div>
</template>

<script>
import LoginPage from "@/components/LoginPage";
import MainPage from "@/components/MainPage";
export default {
  name: "App",
  components: {
    LoginPage,
    MainPage
  },
  data() {
    return {
    }
  },
  computed: {
    view: function () {
      return this.$store.state.account.view;
    }
  },
  created() {
    let user = this.$cookies.get("credentials");
    if (user === null) {
      this.changeView("LoginPage");
      return;
    }
    this.changeView("MainPage");
  },
  mounted() {
  },
  methods: {
    changeView (viewName) {
      this.$store.commit("account/setView", viewName);
    }
  }
};
</script>

<style lang="scss">
</style>
