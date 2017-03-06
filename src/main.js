import Vue from 'vue'
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'
import VueX from 'vuex'

import Main from './Main.vue'
import App from './App.vue'
import Login from './Login.vue'

Vue.use(VueMaterial)
Vue.use(VueRouter)
Vue.use(VueX)

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
  {path: '/app', component: App}
]

const router = new VueRouter({routes})

new Vue({
  router,
  el: '#app',
  render: h => h(Main)
})
