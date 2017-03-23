export default (function () {
  return {
    API_USERS: process.env.NODE_ENV == 'production' ? 'https://api.cloudstudies.de/users' : 'http://localhost:8085/users',
    API_DATA: process.env.NODE_ENV == 'production' ? 'https://api.cloudstudies.de/data' : 'http://localhost:8085/data',
    API_UPLOAD: process.env.NODE_ENV == 'production' ? 'https://upload.cloudstudies.de' : 'http://localhost:8086',
    API_USERDATA: process.env.NODE_ENV == 'production' ? 'https://api.cloudstudies.de/userdata' : 'http://localhost:8085/userdata'
  }
})()
