export default (function () {
  return {
    API_USERS: process.env.NODE_ENV == 'production' ? 'https://users.api.cloudstudies.de' : 'http://localhost:8085',
    API_DATA: process.env.NODE_ENV == 'production' ? 'https://data.api.cloudstudies.de' : 'http://localhost:8086',
    API_UPLOAD: process.env.NODE_ENV == 'production' ? 'https://upload.api.cloudstudies.de' : 'http://localhost:8087',
    API_USERDATA: process.env.NODE_ENV == 'production' ? 'https://userdata.api.cloudstudies.de' : 'http://localhost:8088'
  }
})()
