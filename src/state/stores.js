import axios from 'axios'
import SHA256 from 'crypto-js/sha256'
import Vue from 'vue'

import config from '../config'
import pwhash from '../helpers/pwhash'
import {authCatcher, ajax} from '../helpers/ajax'

const cancels = {
  fetchStore: {}
}

export default {
  namespaced: true,
  state: {},
  mutations: {
    setStore (state, storedata) {
      Vue.set(state, storedata.id, storedata)
    },
    removeStore (state, storeId) {
      Vue.delete(state, storeId)
    }
  },
  actions: {
    fetchStore (context, data) {
      var passwordHash
      var userdataUsed = false
      if (data.password)
        passwordHash = 'p ' + pwhash(data.password)
      else if (context.state[data.id])
        passwordHash = context.state[data.id].password
      else if (context.rootState.account.userdata.stores && context.rootState.account.userdata.stores[data.id]) {
        passwordHash = context.rootState.account.userdata.stores[data.id].password
        userdataUsed = true
      } else
        return Promise.reject(new Error('no store password available'))
      if (cancels.fetchStore[data.id])
        cancels.fetchStore[data.id].cancel()
      cancels.fetchStore[data.id] = axios.CancelToken.source()
      return ajax({
        method: 'GET',
        url: config.API_DATA+'/stores/'+data.id,
        cancelToken: cancels.fetchStore[data.id].token,
        headers: {
          'x-store-auth': passwordHash
        }
      })
      .then(res => {
        res.data.success = true
        const storeSaveData = res.data
        storeSaveData.password = passwordHash
        context.commit('setStore', storeSaveData)
        if (!userdataUsed)
          context.dispatch('account/addStoreToData', {store: {
            id: res.data.id,
            name: res.data.name,
            owner: res.data.owner
          }, password: passwordHash}, {root: true})
        return Promise.resolve({success: true})
      })
      .catch(err => {
        if (!context.state[data.id])
          context.commit('setStore', {id: data.id, success: false})
        if (err.response && err.response.status == 423)
          context.dispatch('account/removeStoreFromData', {storeId: data.id}, {root: true})
        return Promise.resolve({success: false})
      })
    },
    fetchFromLink (context, data) {
      //data.id, data.linkHash
      if (cancels.fetchStore[data.id])
        cancels.fetchStore[data.id].cancel()
      cancels.fetchStore[data.id] = axios.CancelToken.source()
      const passwordHash = 'l '+data.linkHash
      return ajax({
        method: 'GET',
        url: config.API_DATA+'/stores/'+data.id,
        cancelToken: cancels.fetchStore[data.id].token,
        headers: {
          'x-store-auth': passwordHash
        }
      })
      .then(res => {
        res.data.success = true
        const storeSaveData = res.data
        storeSaveData.password = passwordHash
        context.commit('setStore', storeSaveData)
        return Promise.resolve({success: true})
      })
      .catch(err => {
        if (!context.state[data.id])
          context.commit('setStore', {id: data.id, success: false})
        return Promise.resolve({success: false})
      })
    },
    delete (context, data) {
      //data.id
      const store = context.state[data.id]
      if (!store) return
      return ajax({
        method: 'DELETE',
        url: config.API_DATA+'/stores/'+store.id,
        headers: {
          'x-store-auth': context.rootState.account.userdata.stores[data.store.id].password
        }
      })
      .then(res => {
        context.commit('removeStore', store.id)
        context.dispatch('account/removeStoreFromData', {storeId: data.id}, {root: true})
      })
    },
    updateSettings (context, data) {
      //data.id, data.password, data.access
      const ajaxData = {access: data.access}
      if (data.password)
        ajaxData.password = data.password
      return ajax({
        method: 'PUT',
        url: config.API_DATA+'/stores/'+store.id,
        headers: {
          'x-store-auth': context.rootState.account.userdata.stores[data.store.id].password
        },
        data: ajaxData
      })
      .then(res => {
        context.dispatch('fetchStore', {id: data.store.id})
        context.dispatch('account/addStoreToData', {store: {
          id: res.data.id,
          name: res.data.name,
          owner: res.data.owner
        }, password: passwordHash}, {root: true})
      })
    },
    resetLink (context, data) {
      //data.id
      return ajax({
        method: 'PUT',
        url: config.API_DATA+'/stores/'+store.id+'/link',
        headers: {
          'x-store-auth': context.rootState.account.userdata.stores[data.store.id].password
        }
      })
      .then(res => {
        context.dispatch('fetchStore', {id: data.store.id})
      })
    },
    addFolder (context, data) {
      //data.shortname, data.store, data.parentId
      const folderRegex = /[a-zA-Z0-9\.-_ ]+/
      if (!folderRegex.test(data.shortname))
        return Promise.resolve({success: false, error: 'Invalid foldername'})
      return ajax({
        method: 'POST',
        url: config.API_DATA+'/stores/'+data.store.id+'/folders',
        data: {
          shortname: data.shortname,
          parentId: data.parentId
        },
        headers: {
          'x-store-auth': context.rootState.account.userdata.stores[data.store.id].password
        }
      })
      .then(res => {
        context.dispatch('fetchStore', {id: data.store.id})
      })
      .catch(err => {
        if (err.response && err.response.status == 423)
          context.dispatch('account/removeStoreFromData', {storeId: data.store.id}, {root: true})
      })
    },
    renameFile (context, data) {
      //data.fileId, data.storeId, data.newName
      return ajax({
        method: 'PUT',
        url: config.API_DATA+'/file/'+data.fileId+'/name',
        data: {
          newName: data.newName
        },
        headers: {
          'x-store-auth': context.rootState.account.userdata.stores[data.storeId].password
        }
      })
      .then(res => {
        context.dispatch('fetchStore', {id: data.storeId})
      })
      .catch(err => {
        if (err.response && err.response.status == 423)
          context.dispatch('account/removeStoreFromData', {storeId: data.storeId}, {root: true})
      })
    },
    moveFile (context, data) {
      //data.fileId, data.storeId, data.folderId
      return ajax({
        method: 'PUT',
        url: config.API_DATA+'/file/'+data.fileId+'/folder',
        data: {
          folderId: data.folderId
        },
        headers: {
          'x-store-auth': context.rootState.account.userdata.stores[data.storeId].password
        }
      })
      .then(res => {
        context.dispatch('fetchStore', {id: data.storeId})
      })
      .catch(err => {
        if (err.response && err.response.status == 423)
          context.dispatch('account/removeStoreFromData', {storeId: data.storeId}, {root: true})
      })
    },
    deleteFile (context, data) {
      //data.fileId, data.storeId
      return ajax({
        method: 'DELETE',
        url: config.API_DATA+'/file/'+data.fileId,
        headers: {
          'x-store-auth': context.rootState.account.userdata.stores[data.storeId].password
        }
      })
      .then(res => {
        context.dispatch('fetchStore', {id: data.storeId})
      })
      .catch(err => {
        if (err.response && err.response.status == 423)
          context.dispatch('account/removeStoreFromData', {storeId: data.storeId}, {root: true})
      })
    },
    addMemberToStore (context, data) {
      const store = context.state[data.id]
      if (!store || !store.members) return
      axios.post(config.API_DATA+'/stores/'+data.id+'/members?userId='+data.user.id, null, {
        headers: {
          Authorization: context.rootState.account.token,
          'x-store-auth': context.rootState.account.userdata.stores[data.id].password
        }
      })
      .then(res => {
        store.members.push(data.user)
        context.commit('setStore', store)
      })
      .catch(authCatcher)
      .catch(err => {
        if (err.response && err.response.status == 423)
          context.dispatch('account/removeStoreFromData', {storeId: data.id}, {root: true})
      })
    },
    removeMemberFromStore (context, data) {
      const store = context.state[data.id]
      if (!store || !store.members) return
      axios.delete(config.API_DATA+'/stores/'+data.id+'/members?userId='+data.user.id, {
        headers: {
          Authorization: context.rootState.account.token,
          'x-store-auth': context.rootState.account.userdata.stores[data.id].password
        }
      })
      .then(res => {
        store.members.splice(store.members.indexOf(store.members.filter(m => m.id == data.user.id)[0]), 1)
        context.commit('setStore', store)
      })
      .catch(authCatcher)
      .catch(err => {
        if (err.response && err.response.status == 423)
          context.dispatch('account/removeStoreFromData', {storeId: data.id}, {root: true})
      })
    }
  }
}
