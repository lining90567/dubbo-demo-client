import request from '@/utils/request'

export const getAuthorizedRouter = () =>
    request({
        url: '/routers/authorized',
        method: 'get'
    })

export const listRouter = (search) =>
    request({
        url: '/routers',
        method: 'get',
        params: {
            offset: search.offset,
            limit: search.limit,
            name: search.name
        }
    })

export const getRouterById = (id) =>
    request({
        url: '/routers/' + id,
        method: 'get'
    })

export const listByParentId = (parentId) =>
    request({
        url: '/routers/search',
        method: 'get',
        params: {
            parentId: parentId
        }
    })

export const saveRouter = (router) =>
    request({
        url: '/routers',
        method: 'post',
        data: router
    })

export const updateRouter = (id, router) =>
    request({
        url: '/routers/' + id,
        method: 'put',
        data: router
    })

export const removeRouter = (id) => 
    request({
        url: '/routers/' + id,
        method: 'delete'
    })

export const listAllRouter = (includeLocked) =>
    request({
        url: '/routers/all?includeLocked=' + includeLocked,
        method: 'get'
    })