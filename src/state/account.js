import axios from 'axios'

import config from '../config'
import pwhash from '../helpers/pwhash'

export default {
  namespaced: true,
  state: {
    loggedIn: false,
    pwhash: null,
    token: null,
    user: null,
    userdata: {
      stores: {}
    }
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
      state.pwhash = pwhash(data.pw)
    },
    setUserdata (state, data) {
      state.userdata = data
    }
  },
  actions: {
    signin (context, data) {
      context.commit('signin', data)
      context.dispatch('fetchUserdata')
    },
    signup (context, data) {
      context.dispatch('signin', data)
    },
    fetchUserdata (context) {
      if (!context.state.pwhash) return
      axios.get(config.API_USERDATA + '/', {
        headers: {Authorization: context.state.token, 'x-user-pw': context.state.pwhash}
      })
      .then(res => {
        if (res.data)
          context.commit('setUserdata', res.data)
      })
      .catch(e => {})
    },
    storeUserdata (context, userdata) {
      if (!context.state.pwhash) return
      context.commit('setUserdata', userdata)
      axios.post(config.API_USERDATA + '/', userdata, {
        headers: {Authorization: context.state.token, 'x-user-pw': context.state.pwhash}
      })
      .catch(e => {})
    },
    addStoreToData (context, data) {
      context.state.userdata.stores[data.store.id] = data
      context.dispatch('storeUserdata', context.state.userdata)
    }
  }
}
