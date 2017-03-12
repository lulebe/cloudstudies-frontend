import axios from 'axios'
import sha256 from 'crypto-js/sha256'

export default  {
  namespaced: true,
  state: {
    loggedIn: false,
    pwhash: null,
    token: null,
    user: null
  },
  mutations: {
    signout (state) {
      state.loggedIn = false
      state.pwhash = null
      state.token = null
      state.user = null
    },
    signin (state, data) {
      state.loggedIn = true
      state.token = data.token
      state.user = data.user
      state.pwhash = sha256(data.pw)
    }
  },
  actions: {
    signin (state, data) {

    },
    signup (state, data) {

    }
  }
}
