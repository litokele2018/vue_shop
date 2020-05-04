import {
  request
} from './request'

export function getUsersList(pagenum, pagesize, query) {
  return request({
    method: 'GET',
    url: '/users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

export function putStateChange(id, state) {
  return request({
    method: 'PUT',
    url: `users/${id}/state/${state}`
  })
}

export function postNewUser(userInfo) {
  return request({
    method: 'POST',
    url: 'users',
    data: userInfo
  })
}

export function deleteUser(id) {
  return request({
    method: 'delete',
    url: `users/${id}`
  })
}

export function editUser(editInfo) {
  console.log(editInfo)
  return request({
    method: 'put',
    url: `users/${editInfo.id}`,
    data: {
      email: editInfo.email,
      mobile: editInfo.mobile
    }
  })
}