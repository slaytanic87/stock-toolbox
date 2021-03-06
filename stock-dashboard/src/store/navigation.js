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
    },
    socialMedia: {
        selected: "text-purple-400 border-purple-400",
        unselect: "text-gray-500 border-gray-900"
    }
};

const state = {
    view: "Overview",
    overviewBarCss: navBarMenueStyles.overview.selected,
    newsBarCss: navBarMenueStyles.news.unselect,
    calendarBarCss: navBarMenueStyles.calendar.unselect,
    socialMediaBarCss: navBarMenueStyles.socialMedia.unselect,
    watchList: []
};

const getters = {

}

const mutations = {
    setView: (state, value) => {
        state.view = value;
        state.newsBarCss = navBarMenueStyles.news.unselect;
        state.calendarBarCss = navBarMenueStyles.calendar.unselect;
        state.overviewBarCss = navBarMenueStyles.overview.unselect;
        state.socialMediaBarCss = navBarMenueStyles.socialMedia.unselect;

        if (state.view === "Overview") {
            state.overviewBarCss = navBarMenueStyles.overview.selected;
        } else if (state.view === "News") {
            state.newsBarCss = navBarMenueStyles.news.selected;
        } else if (state.view === "Calendar") {
            state.calendarBarCss = navBarMenueStyles.calendar.selected;
        } else if (state.view === "SocialMedia") {
            state.socialMediaBarCss = navBarMenueStyles.socialMedia.selected;
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
