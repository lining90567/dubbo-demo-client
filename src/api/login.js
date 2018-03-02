import request from '@/utils/request'
import qs from 'qs'

export const loginByUsername = (username, password) =>
    request({
        url: '/login',
        method: 'post',
        data: qs.stringify({
            username,
            password
        })
    })