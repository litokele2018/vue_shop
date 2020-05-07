import {
  request
} from './request'

export function getGoodsList(query, pagenum, pagesize) {
  return request({
    method: 'GET',
    url: `/goods`,
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

export function addGoods(form) {
  console.log(form)
  return request({
    method: 'post',
    url: `/goods`,
    data: {
      goods_name: form.goods_name,
      goods_cat: form.goods_cat,
      goods_price: form.goods_price,
      goods_number: form.goods_number,
      goods_weight: form.goods_weight,
      goods_introduce: form.goods_introduce,
      pics: form.pics,
      attrs: form.attrs
    }
  })
}

export function deleteGoods(id) {
  return request({
    method: 'delete',
    url: `/goods/${id}`,
  })
}