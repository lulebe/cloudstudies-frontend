import axios from 'axios'

import config from '../config'

let store = null

export const setStore = s => {store = s}

export const authCatcher = err => {
  if (err.response && err.response.status == 401)
    window.location.href = '/app.html'
  else
    return Promise.reject(err)
}

export const signin = (username, pwhash, cancelToken) => {
  return axios.post(config.API_USERS + '/signin', {
    username,
    pwhash
  }, {
    cancelToken: cancelToken
  })
  .then(res => {
    store.dispatch('account/signin', Object.assign({}, res.data, {pw: pwhash}))
  })
  .catch(e => {
    window.location.href = '/app.html#/'
  })
}

export const ajax = options => {
  return playXhr(options)
  .catch(e => {
    if (e.response && e.response.status == 401)
      return signin(store.state.account.user.name, store.state.account.pwhash, options.cancelToken)
      .then(() => playXhr(options))
    else
      return Promise.reject(e)
  })
}

function playXhr (options) {
  if (!options.headers)
    options.headers = {}
  options.headers.Authorization = store.state.account.token
  return axios(options)
}
