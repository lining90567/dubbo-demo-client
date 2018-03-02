import request from '@/utils/request'

export const listRole = (search) => 
    request({
        url: '/roles',
        method: 'get',
        params: {
            offset: search.offset,
            limit: search.limit,
            name: search.name
        }        
    })

export const saveRole = (role) => 
    request({
        url: '/roles',
        method: 'post',
        data: role
    })

export const getRoleById = (id) =>
    request({
        url: '/roles/' + id,
        method: 'get'
    })

export const updateRole = (id, role) =>
    request({
        url: '/roles/' + id,
        method: 'put',
        data: role
    })

export const listAllRole = () =>
    request({
        url: '/roles/all',
        method: 'get'
    })

export const removeRole = (id) =>
    request({
        url: '/roles/' + id,
        method: 'delete'        
    })    
    
export const listResourcePermission = (id) =>
    request({
        url: '/roles/' + id + '/resourcePermissions',
        method: 'get'        
    })

export const savePermission = (roleId, permission) =>
    request({
        url: '/roles/' + roleId + '/permissions',
        method: 'post',
        data: permission
    })