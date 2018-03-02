import request from '@/utils/request'

export const listResource = (routerId) =>
    request({
        url: '/resources?routerId=' + routerId,
        method: 'get'
    })

export const getResourceById = (id) => 
    request({
        url: '/resources/' + id,
        method: 'get'        
    })

export const saveResource = (resource) =>
    request({
        url: '/resources',
        method: 'post',
        data: resource
    })

export const updateResource = (id, resource) =>
    request({
        url: '/resources/' + id,
        method: 'put',
        data: resource
    })
    
export const removeResource = (id) => 
    request({
        url: '/resources/' + id,
        method: 'delete'
    })
    
export const listResourcePermission = (routerId) =>
    request({
        url: '/resources/permissions',
        method: 'get',
        params: {
            routerId: routerId
        }
    })
    
export const listAvailableResource = () =>
    request({
        url: '/resources/available',
        method: 'get'
    })