import moduleAccount from './account.js'
import moduleStores from './stores.js'

export default {
  modules: {
    account: moduleAccount,
    stores: moduleStores
  },
  state: {
    drawerOpen: false
  },
  mutations: {
    openDrawer (state) {
      state.drawerOpen = true
    },
    closeDrawer (state) {
      state.drawerOpen = false
    }
  }
}
