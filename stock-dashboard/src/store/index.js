import Vue from "vue";
import Vuex from "vuex";
import { navigation } from "@/store/navigation";

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        navigation
    },
});
