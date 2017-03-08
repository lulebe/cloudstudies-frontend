export default {
  state: {
    drawerOpen: false,
    loggedIn: false,
    user: null,
    token: null
  },
  mutations: {
    openDrawer (state) {
      state.drawerOpen = true
    },
    closeDrawer (state) {
      state.drawerOpen = false
    },
    signout (state) {
      state.loggedIn = false
      state.user = null
      state.token = null
    },
    signin (state, data) {
      state.loggedIn = true
      state.user = data.user
      state.token = data.token
    }
  }
}
