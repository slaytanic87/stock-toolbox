<template>
  <div id="app">
    <component v-bind:is="view"></component>
  </div>
</template>

<script>
import LoginPage from "@/components/LoginPage";
import MainPage from "@/components/MainPage";
import SignUpPage from "@/components/SignUpPage";
export default {
  name: "App",
  components: {
    LoginPage,
    MainPage,
    SignUpPage
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
    let user = this.$store.state.account.authedUser;
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
