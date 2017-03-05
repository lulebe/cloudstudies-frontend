import Vue from 'vue'
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'

import App from './App.vue'

Vue.use(VueMaterial)
Vue.use(VueRouter)

Vue.material.registerTheme('default', {
  primary: 'green',
  accent: 'red',
  warn: 'deep-orange',
  background: 'white'
})

new Vue({
  el: '#app',
  render: h => h(App)
})
