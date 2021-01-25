const state = {
    view: "Overview",
    watchList: []
};

const getters = {

}

const mutations = {
    setView: (state, value) => {
        state.view = value;
    },
    setWatchList: (state, watchlist) => {
        state.watchList = watchlist
    }
}

const actions = {

}

export const navigation = {
    namespaced: true,
    state: state,
    actions,
    getters,
    mutations
}
