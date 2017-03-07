import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false,
    user: null,
    token: null
  },
  mutations: {
    signout (state) {
      state.loggedIn = false
      state.user = null
      state.token = null
    },
    signin (state, data) {
      state.loggedIn = true
      state.user = data.user
      state.token = data.token
    }
  }
})
