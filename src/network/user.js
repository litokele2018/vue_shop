import { request } from './request'

export function getUsersList(pagenum, pagesize) {
  return request({
    method: 'GET',
    url: '/users',
    params: {
      pagenum,
      pagesize
    }
  })
}