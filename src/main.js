import Vue from 'vue'
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'
import Vuex from 'vuex'


import storeData from './state/main'
import Main from './Main.vue'
import App from './App.vue'
import Login from './Login.vue'
import Signup from './Signup.vue'
import PWReset from './PWReset.vue'
import Profile from './app/Profile.vue'
import Dashboard from './app/Dashboard.vue'

import Toolbar from './app/components/Toolbar.vue'
Vue.component('app-toolbar', Toolbar)

Vue.use(VueMaterial)
Vue.use(VueRouter)
Vue.use(Vuex)

const store = new Vuex.Store(storeData)

Vue.material.registerTheme('default', {
  primary: {
    color: 'green',
    hue: 600
  },
  accent: {
    color: 'red',
    hue: 500
  },
  warn: 'deep-orange',
  background: {
    color: 'grey',
    hue: 500
  }
})
Vue.material.registerTheme('sidebar', {
  primary: 'purple',
  accent: 'indigo'
})

const routes = [
  {path: '/', component: Login},
  {path: '/signup', component: Signup},
  {path: '/pwreset', component: PWReset},
  {path: '/app', component: App, beforeEnter: (to, from, next) => {
    if (!store.state.loggedIn)
      next('/')
    else
      next()
  }, children: [
    {path: 'profile', component: Profile},
    {path: 'dashboard', component: Dashboard}
  ]}
]

const router = new VueRouter({routes})

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(Main)
})
