import moduleAccount from './account.js'

export default {
  modules: {
    account: moduleAccount,
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
