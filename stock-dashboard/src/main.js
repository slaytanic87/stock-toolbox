import Vue from "vue";
import VueCookies from "vue-cookies";
import App from "./App.vue";
import "tailwindcss/tailwind.css";
import { store } from "@/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.use(VueCookies);
Vue.config.productionTip = false


new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
