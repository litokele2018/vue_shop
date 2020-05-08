import {
  request
} from './request'

export function getOrder(orderInfo) {
  return request({
    method: 'GET',
    url: `/orders`,
    params: orderInfo
  })
}

export function getDelivery() {
  return request({
    method: 'GET',
    url: `/kuaidi/1106975712662`,
  })
}