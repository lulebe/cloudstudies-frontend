import axios from 'axios'
import Vue from 'vue'

import config from '../config'
import pwhash from '../helpers/pwhash'
import {authCatcher, ajax} from '../helpers/ajax'

const cancels = {
  fetchUserdata: axios.CancelToken.source(),
  storeUserdata: axios.CancelToken.source(),
  fetchOwnedStores: axios.CancelToken.source(),
  fetchMemberStores: axios.CancelToken.source()
}

export default {
  namespaced: true,
  state: {
    loggedIn: false,
    pwhash: null,
    token: null,
    tokenValidUntil: null,
    user: null,
    userdata: {
      stores: {}
    },
    ownedStores: [],
    memberStores: []
  },
  mutations: {
    signin (state, data) {
      state.loggedIn = true
      state.token = data.token
      state.user = data.user
      state.pwhash = data.pw
      state.tokenValidUntil = Date.now() + 86000000 //almost 24h
    },
    setUserdata (state, data) {
      state.userdata = data
    },
    setOwnedStores (state, data) {
      Vue.set(state, 'ownedStores', data)
    },
    setMemberStores (state, data) {
      Vue.set(state, 'memberStores', data)
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
      cancels.fetchUserdata.cancel()
      cancels.fetchUserdata = axios.CancelToken.source()
      ajax({
        method: 'GET',
        url: config.API_USERDATA + '/',
        CancelToken: cancels.fetchUserdata.token,
        headers: {'x-user-pw': context.state.pwhash}
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
      cancels.storeUserdata.cancel()
      cancels.storeUserdata = axios.CancelToken.source()
      ajax({
        method: 'POST',
        url: config.API_USERDATA + '/', userdata,
        cancelToken: cancels.storeUserdata.token,
        headers: {'x-user-pw': context.state.pwhash}
      })
      .catch(e => {})
    },
    addStoreToData (context, data) {
      Vue.set(context.state.userdata.stores, data.store.id, data)
      context.dispatch('storeUserdata', context.state.userdata)
    },
    removeStoreFromData (context, data) {
      delete context.state.userdata.stores[data.storeId]
      context.dispatch('storeUserdata', context.state.userdata)
    },
    fetchOwnedStores (context) {
      cancels.fetchOwnedStores.cancel()
      cancels.fetchOwnedStores = axios.CancelToken.source()
      ajax({
        method: 'GET',
        url: config.API_USERS + '/ownedStores',
        CancelToken: cancels.fetchOwnedStores
      })
      .then(res => {
        context.commit('setOwnedStores', res.data)
      })
      .catch(e => {})
    },
    fetchMemberStores (context) {
      cancels.fetchMemberStores.cancel()
      cancels.fetchMemberStores = axios.CancelToken.source()
      ajax({
        method: 'GET',
        url: config.API_USERS + '/stores',
        CancelToken: cancels.fetchMemberStores
      })
      .then(res => {
        context.commit('setMemberStores', res.data)
      })
      .catch(e => {})
    }
  }
}
