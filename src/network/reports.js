import {
  request
} from './request'

export function getReportsData() {
  return request({
    method: 'GET',
    url: `/reports/type/1`,
  })
}