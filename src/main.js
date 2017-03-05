import Vue from 'vue'
import KeenUI from 'keen-ui'
import VueRouter from 'vue-router'

import App from './App.vue'

Vue.use(KeenUI)
Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h(App)
})
