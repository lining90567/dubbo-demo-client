import request from '@/utils/request'

export const listUser = (search) => 
    request({
        url: '/users',
        method: 'get',
        params: {
            name: search.username,
            sort: search.sort,
            offset: search.offset,
            limit: search.limit
        }
    })

export const getUser = (id) =>
    request({
        url: '/users/' + id,
        method: 'get'
    })

export const updateUser = (id, user) =>
    request({
        url: '/users/' + id,
        method: 'put',
        data: user
    })

export const saveUser = (user) => 
    request({
        url: '/users',
        method: 'post',
        data: user        
    })

export const removeUser = (id) => 
    request({
        url: '/users/' + id,
        method: 'delete'
    })

export const changePassword = (userId, password) => 
    request({
        url: '/users/' + userId + "/password",
        method: 'put',
        params: {
            password: password
        }
    })

export const listUserRole = (userId) => 
    request({
        url: '/users/' + userId + '/roles',
        method: 'get'
    })

export const getCurrentUser = () =>
    request({
        url: '/users/me',
        method: 'get'
    })

export const updateCurrentUser = (user) =>
    request({
        url: '/users/me',
        method: 'put',
        data: user
    })    