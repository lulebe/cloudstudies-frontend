import Vue from 'vue'
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'

import store from './state/main'
import Main from './Main.vue'
import App from './App.vue'
import Login from './Login.vue'
import Signup from './Signup.vue'
import PWReset from './PWReset.vue'

Vue.use(VueMaterial)
Vue.use(VueRouter)

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

const routes = [
  {path: '/', component: Login},
  {path: '/signup', component: Signup},
  {path: '/pwreset', component: PWReset},
  {path: '/app', component: App}
]

const router = new VueRouter({routes})

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(Main)
})
