const navBarMenueStyles = {
    overview: {
        selected: "text-blue-400 border-blue-400",
        unselect: "text-gray-500 border-gray-900"
    },
    news: {
        selected: "text-pink-400 border-pink-400",
        unselect: "text-gray-500 border-gray-900"
    },
    calendar: {
        selected: "text-green-400 border-green-400",
        unselect: "text-gray-500 border-gray-900"
    }
};

const state = {
    view: "Overview",
    overviewBarCss: navBarMenueStyles.overview.selected,
    newsBarCss: navBarMenueStyles.news.unselect,
    calendarBarCss: navBarMenueStyles.calendar.unselect,
    watchList: []
};

const getters = {

}

const mutations = {
    setView: (state, value) => {
        state.view = value;
        state.newsBarCss = navBarMenueStyles.news.unselect;
        state.calendarBarCss = navBarMenueStyles.calendar.unselect
        state.overviewBarCss = navBarMenueStyles.overview.unselect;

        if (state.view === "Overview") {
            state.overviewBarCss = navBarMenueStyles.overview.selected;
        } else if (state.view === "News") {
            state.newsBarCss = navBarMenueStyles.news.selected;
        } else if (state.view === "Calendar") {
            state.calendarBarCss = navBarMenueStyles.calendar.selected
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
