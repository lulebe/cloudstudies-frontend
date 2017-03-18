import axios from 'axios'
import sha256 from 'crypto-js/sha256'
import aes from 'crypto-js/aes'

export default {
  namespaced: true,
  state: {
    loggedIn: false,
    pwhash: null,
    token: null,
    user: null,
    userdata: null
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
    },
    setUserdata (state, data) {
      state.userdata = data
    }
  },
  actions: {
    signin (context, data) {

    },
    signup (context, data) {

    },
    fetchUserdata (context) {
      if (!context.state.pwhash) return
      axios.get(config.API_USERDATA + '/')
      .then(encryptedData => {
        const decryptedData = aes.decrypt(encryptedData, context.state.pwhash)
        context.commit('account/setUserdata', JSON.parse(decryptedData))
      })
      .catch(e => {})
    },
    storeUserdata (context, userdata) {
      if (!context.state.pwhash) return
      context.commit('account/setUserdata', userdata)
      const encryptedData = aes.encrypt(JSON.stringify(userdata), context.state.pwhash)
      axios.post(config.API_USERDATA + '/', {data: encryptedData})
      .catch(e => {})
    }
  }
}
