import request from '@/utils/request'
import qs from 'qs'

export const getToken = (loginName, password) => 
    request({
        url: '/auth/token',
        method: 'post',
        data: qs.stringify({
            loginName,
            password
        })
    })