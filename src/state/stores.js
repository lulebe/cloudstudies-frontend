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
      const passwordHash = data.pwhashed ? data.password : pwhash(data.password)
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
    }
  }
}
