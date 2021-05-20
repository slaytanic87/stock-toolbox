import Vue from "vue";
import Vuex from "vuex";
import { navigation } from "@/store/navigation";
import { account } from "@/store/account";

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        navigation,
        account
    },
});
