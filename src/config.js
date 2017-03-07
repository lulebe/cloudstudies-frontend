export default (function () {
  return {
    API_USERS: process.env.NODE_ENV == 'production' ? 'https://users.api.cloudstudies.de' : 'http://localhost:8085'
  }
})()
