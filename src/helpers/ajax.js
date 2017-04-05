let router = null

function logout () {
  if (router)
    router.push('/')
}

export const setRouter = r => {
  router = r
}

export const authCatcher = err => {
  if (err.response && err.response.status == 401)
    logout()
  else
    return Promise.reject(err)
}
