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
import Search from './app/Search.vue'
import Newstore from './app/Newstore.vue'
import Store from './app/Store.vue'

import cToolbar from './components/Toolbar.vue'
import cForm from './components/Form.vue'
import cPwUserdataInfo from './components/PwUserdataInfo.vue'
import cFolder from './components/Folder.vue'
Vue.component('app-toolbar', cToolbar)
Vue.component('app-form', cForm)
Vue.component('app-pwuserdatainfo', cPwUserdataInfo)
Vue.component('app-folder', cFolder)

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
Vue.material.registerTheme('searchbar', {
  primary: 'grey',
  accent: 'indigo'
})
Vue.material.registerTheme('secondarybar', {
  primary: {
    color: 'grey',
    hue: 300
  },
  accent: 'indigo'
})

const routes = [
  {path: '/', component: Login},
  {path: '/signup', component: Signup},
  {path: '/pwreset', component: PWReset},
  {path: '/app', component: App, beforeEnter: (to, from, next) => {
    if (!store.state.account.loggedIn)
      next('/')
    else
      next()
  }, children: [
    {path: 'profile', component: Profile},
    {path: 'dashboard', component: Dashboard},
    {path: 'search', component: Search, props: true},
    {path: 'newstore', component: Newstore},
    {path: 'store/:storeid', component: Store, props: true}
  ]}
]

const router = new VueRouter({routes})

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(Main)
})
