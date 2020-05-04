import axios from 'axios'

export function request(config) {
  return new Promise((resolve, reject) => {
    let instance = axios.create({
      baseURL: 'http://127.0.0.1:8888/api/private/v1'
    })
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = window.sessionStorage.getItem('token')
      return config
    })
    instance(config).then(res => {
      let {data} = res
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function requestLogin(username, password) {
  return request({
    method: 'POST',
    url: '/login',
    data: {
      username,
      password
    }
  })
}

export function requestMenu() {
  return request({
    method: 'GET',
    url: '/menus'
  })
}
