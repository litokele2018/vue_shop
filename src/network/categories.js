import {
  request
} from './request'

export function getCategoriesList(type, pagenum, pagesize) {
  return request({
    method: 'GET',
    url: `/categories`,
    params: {
      type,
      pagenum,
      pagesize
    }
  })
}

export function sendAddCategories(form) {
  return request({
    method: 'post',
    url: `/categories`,
    data: {
      cat_pid: form.cat_pid,
      cat_name: form.cat_name,
      cat_level: form.cat_level
    }
  })
}

export function editCategory(id, cat_name) {
  return request({
    method: 'put',
    url: `/categories/${id}`,
    data: {
      cat_name
    }
  })
}


export function deleteCategory(id) {
  return request({
    method: 'delete',
    url: `/categories/${id}`,
  })
}
