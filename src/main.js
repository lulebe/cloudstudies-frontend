require('core-js/shim')

import Vue from 'vue'
import VueMaterial from 'vue-material'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import Bugsnag from 'bugsnag-js'
import BugsnagVue from 'bugsnag-vue'

import storeData from './state/main'
import {setStore as setStoreForAjax} from './helpers/ajax'

import Main from './Main.vue'
import App from './App.vue'
import Login from './Login.vue'
import Signup from './Signup.vue'
import PWReset from './PWReset.vue'
import Profile from './app/Profile.vue'
import Dashboard from './app/Dashboard.vue'
import Search from './app/Search.vue'
import Newstore from './app/Newstore.vue'
import Storelink from './app/Storelink.vue'
import Store from './app/Store.vue'
import StoreFolder from './app/store/Folder.vue'
import StoreNewtest from './app/store/Newtest.vue'

import pStoreSettings from './app/partials/StoreSettings.vue'
Vue.component('app-store-settings', pStoreSettings)

import cToolbar from './components/Toolbar.vue'
import cForm from './components/Form.vue'
import cPwUserdataInfo from './components/PwUserdataInfo.vue'
import cFolder from './components/Folder.vue'
import cFolderTree from './components/FolderTree.vue'
import cUpload from './components/Upload.vue'
import cUploadInfo from './components/UploadInfo.vue'
Vue.component('app-toolbar', cToolbar)
Vue.component('app-form', cForm)
Vue.component('app-pwuserdatainfo', cPwUserdataInfo)
Vue.component('app-folder', cFolder)
Vue.component('app-folder-tree', cFolderTree)
Vue.component('app-upload', cUpload)
Vue.component('app-uploadinfo', cUploadInfo)

import fFilesize from './helpers/filesizeFilter'
Vue.filter('fileSize', fFilesize)

console.log("KEY", process.env.BUGSNAGKEY)
if (process.env.BUGSNAGKEY) {
  const bugsnagClient = Bugsnag(process.env.BUGSNAGKEY)
  bugsnagClient.use(BugsnagVue(Vue))
}

Vue.use(VueMaterial)
Vue.use(VueRouter)
Vue.use(Vuex)

const store = new Vuex.Store(storeData)
setStoreForAjax(store)

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
  background: 'white'
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
  {path: '/app', component: App, children: [
    {path: 'profile', component: Profile},
    {path: 'dashboard', component: Dashboard},
    {path: 'search', component: Search, props: true},
    {path: 'newstore', component: Newstore},
    {path: 'storelink/:storeid/:storelink', name: 'storelink', component: Storelink, props: true},
    {path: 'store/:storeid', component: Store, props: true, children: [
      {path: ':folderpath*/newtest', component: StoreNewtest, props: true},
      {path: ':folderpath*', component: StoreFolder, props: true}
    ]}
  ]}
]

const router = new VueRouter({routes})

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(Main)
})
