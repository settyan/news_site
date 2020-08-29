import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    headline: [],
    isLoadingHeadline: false,
    maxHeadlineSize: 30
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
        `${process.env.VUE_APP_PROXY_URL}/${process.env.VUE_APP_API_URL}/v2/top-headlines?country=jp&apiKey=${process.env.VUE_APP_API_KEY}&pageSize=${state.maxHeadlineSize}`,
        {
          mode: "cros"
        }
      );
      const json = await response.json();
      const headline = json.articles || [];
      commit("setHeadline", headline);
      commit("setIsLoadingHeadline", false);
    }
  }
});
