const state = {
    view: "LoginPage"
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