import axios from 'axios'

export function request(config) {
  return new Promise((resolve, reject) => {
    let instance = axios.create({
      baseURL: 'http://127.0.0.1:8888/api/private/v1'
    })
    instance(config).then(res => {
      let {data} = res
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
}
