import moduleAccount from './account.js'
import moduleStores from './stores.js'

export default {
  modules: {
    account: moduleAccount,
    stores: moduleStores
  },
  state: {
    drawerOpen: false,
    title: 'Cloud Studies'
  },
  mutations: {
    openDrawer (state) {
      state.drawerOpen = true
    },
    closeDrawer (state) {
      state.drawerOpen = false
    },
    setTitle (state, title) {
      state.title = title,
      document.title = title
    }
  }
}
