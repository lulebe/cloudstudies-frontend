import axios from 'axios'
import Vue from 'vue'

import config from '../config'
import pwhash from '../helpers/pwhash'
import {authCatcher} from '../helpers/ajax'

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
    updateUser (context, data) {
      const putData = {}
      if (data.email)
        putData.email = data.email
      if (data.passwordnew)
        putData.password = pwhash(data.passwordnew)
      if (data.passwordold)
        putData.oldPassword = pwhash(data.passwordold)
      axios.put(config.API_USERS+'/', putData)
      .then(res => {
        // TODO: handle response and update state
      })
      .catch(authCatcher)
      .catch(e => {
        // TODO: handle error and update state
      })
    },
    fetchUserdata (context) {
      if (!context.state.pwhash) return
      axios.get(config.API_USERDATA + '/', {
        headers: {Authorization: context.state.token, 'x-user-pw': context.state.pwhash}
      })
      .then(res => {
        console.log(res.data)
        if (res.data)
          context.commit('setUserdata', res.data)
      })
      .catch(authCatcher)
      .catch(e => {})
    },
    storeUserdata (context, userdata) {
      if (!context.state.pwhash) return
      context.commit('setUserdata', userdata)
      axios.post(config.API_USERDATA + '/', userdata, {
        headers: {Authorization: context.state.token, 'x-user-pw': context.state.pwhash}
      })
      .catch(authCatcher)
      .catch(e => {})
    },
    addStoreToData (context, data) {
      Vue.set(context.state.userdata.stores, data.store.id, data)
      context.dispatch('storeUserdata', context.state.userdata)
    },
    removeStoreFromData (context, data) {
      delete context.state.userdata.stores[data.storeId]
      context.dispatch('storeUserdata', context.state.userdata)
    }
  }
}
