import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    headline: [],
    isLoadingHeadline: false,
    maxHeadlineSize: 9
  },
  getters: {
    getIsLoadingHeadline(state) {
      return state.isLoadingHeadline;
    },
    getHeadlineSize(state) {
      return state.headline.length;
    },
    getHeadline(state) {
      return state.headline;
    }
  },
  mutations: {
    setHeadline(state, headline) {
      state.headline = headline;
    },
    setIsLoadingHeadline(state, isLoadingHeadline) {
      state.isLoadingHeadline = isLoadingHeadline;
    }
  },
  actions: {
    async fetchHeadline({ state, commit }) {
      commit("setIsLoadingHeadline", true);
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/api/v3/top-news?token=${process.env.VUE_APP_API_KEY}&max=${state.maxHeadlineSize}`
      );
      const json = await response.json();
      const headline = json.articles || [];
      commit("setHeadline", headline);
      commit("setIsLoadingHeadline", false);
    }
  }
});
