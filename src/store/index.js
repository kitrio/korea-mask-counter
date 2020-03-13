import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAllowLocation: false
  },
  mutations: {
    setAllowLocation (state, payload) {
      state.isAllowLocation = payload
    }
  },
  actions: {
    locationAllowing ({ commit }, payload) {
      commit('setAllowLocation', payload)
    }
  },
  modules: {
  }
})
