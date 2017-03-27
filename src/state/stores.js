import axios from 'axios'
import SHA256 from 'crypto-js/sha256'

import config from '../config'
import pwhash from '../helpers/pwhash'

export default {
  namespaced: true,
  state: {},
  mutations: {
    setStore (state, storedata) {
      state[storedata.id] = storedata
    }
  },
  actions: {
    fetchStore(context, data) {
      var passwordHash
      if (data.password)
        passwordHash = data.pwhashed ? data.password : pwhash(data.password)
      else if (context.rootState.account.userdata.stores && context.rootState.account.userdata.stores[data.id])
        passwordHash = context.rootState.account.userdata.stores[data.id].password
      else
        return Promise.reject(new Error('no store password available'))
      axios.get(config.API_DATA+'/stores/'+data.id, {
        headers: {
          Authorization: context.rootState.account.token,
          'x-store-auth': 'p ' + passwordHash
        }
      })
      .then(res => {
        context.commit('setStore', res.data)
        context.dispatch('account/addStoreToData', {store: res.data, password: passwordHash}, {root: true})
      })
      .catch(e => {
        context.commit('setStore', new Error('Server Connection Error'))
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
    }
  }
}
