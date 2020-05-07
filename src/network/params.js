import {
  request
} from './request'

export function getParams(id, sel) {
  return request({
    method: 'GET',
    url: `/categories/${id}/attributes`,
    params: {
      sel
    }
  })
}

export function addParams(cat_id, attr_name, attr_sel, attr_vals) {
  return request({
    method: 'POST',
    url: `/categories/${cat_id}/attributes`,
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}

export function editParams(cat_id, attr_id, attr_name, attr_sel, attr_vals) {
  return request({
    method: 'put',
    url: `/categories/${cat_id}/attributes/${attr_id}`,
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}

export function deleteParams(cat_id, attr_id) {
  return request({
    method: 'delete',
    url: `/categories/${cat_id}/attributes/${attr_id}`
  })
}