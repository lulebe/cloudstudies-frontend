import axios from 'axios'

import config from '../config'

export default {
  namespaced: true,
  state: {},
  mutations: {
    setStore (state, storedata) {
      state[storedata.id] = storedata
    }
  },
  actions: {
    fetchStore(context, storeid, storepw) {
      axios.get(config.API_DATA+'/'+storeid, {
        headers: {
          Authentication: context.state.accounts.token,
          'x-store-auth': storepw
        }
      })
      .then(res => {
        context.commit('stores/setStore', res.data)
      })
      .catch(e => {
        context.commit('stores/setStore', new Error('Server Connection Error'))
      })
    }
  }
}