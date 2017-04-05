import axios from 'axios'
import SHA256 from 'crypto-js/sha256'
import Vue from 'vue'

import config from '../config'
import pwhash from '../helpers/pwhash'
import {authCatcher} from '../helpers/ajax'

export default {
  namespaced: true,
  state: {},
  mutations: {
    setStore (state, storedata) {
      Vue.set(state, storedata.id, storedata)
    }
  },
  actions: {
    fetchStore(context, data) {
      var passwordHash
      var userdataUsed = false
      if (data.password)
        passwordHash = pwhash(data.password)
      else if (context.rootState.account.userdata.stores && context.rootState.account.userdata.stores[data.id]) {
        passwordHash = context.rootState.account.userdata.stores[data.id].password
        userdataUsed = true
      } else
        return Promise.reject(new Error('no store password available'))
      axios.get(config.API_DATA+'/stores/'+data.id, {
        headers: {
          Authorization: context.rootState.account.token,
          'x-store-auth': 'p ' + passwordHash
        }
      })
      .then(res => {
        context.commit('setStore', res.data)
        if (!userdataUsed)
          context.dispatch('account/addStoreToData', {store: {
            id: res.data.id,
            name: res.data.name,
            owner: res.data.owner
          }, password: passwordHash}, {root: true})
      })
      .catch(authCatcher)
      .catch(err => {
        context.commit('setStore', {id: data.id, success: false})
        if (err.response && err.response.status == 423)
          context.dispatch('account/removeStoreFromData', {storeId: data.id}, {root: true})
      })
    },
    addFolder(context, data) {
      //data.shortname, data.store, data.parentId
      return axios.post(config.API_DATA+'/stores/'+data.store.id+'/folders', {
          shortname: data.shortname,
          parentId: data.parentId
        }, {
        headers: {
          Authorization: context.rootState.account.token,
          'x-store-auth': 'p ' + context.rootState.account.userdata.stores[data.store.id].password
        }
      })
      .then(res => {
        context.dispatch('fetchStore', {id: data.store.id})
      })
      .catch(authCatcher)
      .catch(err => {
        if (err.response && err.response.status == 423)
          context.dispatch('account/removeStoreFromData', {storeId: data.id}, {root: true})
      })
    }
  }
}
