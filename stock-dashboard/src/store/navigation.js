const navBarMenueStyles = {
    overview: {
        selected: "text-blue-400 border-blue-400",
        unselect: "text-gray-500 border-gray-900"
    },
    news: {
        selected: "text-pink-400 border-pink-400",
        unselect: "text-gray-500 border-gray-900"
    }
};

const state = {
    view: "Overview",
    overviewBarCss: navBarMenueStyles.overview.selected,
    newsBarCss: navBarMenueStyles.news.unselect,
    watchList: []
};

const getters = {

}

const mutations = {
    setView: (state, value) => {
        state.view = value;
        if (state.view === "Overview") {
            state.overviewBarCss = navBarMenueStyles.overview.selected;
            state.newsBarCss = navBarMenueStyles.news.unselect;
        } else if (state.view === "News") {
            state.overviewBarCss = navBarMenueStyles.overview.unselect;
            state.newsBarCss = navBarMenueStyles.news.selected;
        }
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
