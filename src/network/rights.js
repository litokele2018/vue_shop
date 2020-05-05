import {
  request
} from './request'

export function getRightsList(type = 'list') {
  return request({
    method: 'GET',
    url: `/rights/${type}`
  })
}

export function getRoleList(type = 'list') {
  return request({
    method: 'GET',
    url: `/roles`
  })
}

export function deleteRoleRights(roleId, rightId) {
  return request({
    method: 'delete',
    url: `/roles/${roleId}/rights/${rightId}`
  })
}

export function changeRoleRights(roleId, str) {
  return request({
    method: 'POST',
    url: `/roles/${roleId}/rights`,
    data: {
      rids: str
    }
  })
}

export function addRole(roleName, roleDesc) {
  return request({
    method: 'POST',
    url: `/roles`,
    data: {
      roleName,
      roleDesc
    }
  })
}

export function editRole(form) {
  return request({
    method: 'put',
    url: `/roles/${form.roleId}`,
    data: {
      roleName: form.authName,
      roleDesc: form.roleDesc
    }
  })
}

export function deleteRole(id) {
  return request({
    method: 'delete',
    url: `/roles/${id}`
  })
}


