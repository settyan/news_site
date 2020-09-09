import Vue from "vue";
import Vuex from "vuex";
import { createClient } from "../lib/contentful";

const client = createClient();

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    headline: [],
    isLoadingHeadline: true,
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
      const entries = await client
        .getEntries({ content_type: "post", limit: state.maxHeadlineSize })
        .then(entries => entries.items);
      commit("setHeadline", entries);
      commit("setIsLoadingHeadline", false);
    }
  }
});
