import Vue from "vue";
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

const state = {
    view: null,
    authedUser: Vue.$cookies.get("credentials")
}

const actions = {}
const getters = {}

const mutations = {
    setView: (state, value) => {
        state.view = value;
    }
}

export const account = {
    namespaced: true,
    state: state,
    actions,
    getters,
    mutations
}