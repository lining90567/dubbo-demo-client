import axios from 'axios';
import store from '@/store';

axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://localhost:8080/';

// http request 拦截器
axios.interceptors.request.use(
    config => {
        console.log(JSON.stringify(config.data));
        if (store.state.token) {
            config.headers.Authorization = `X-Token ${store.state.token}`;
            //config.headers['X-Token'] = store.getters.token;
        }
        if(config.method  === 'post'){
            config.data = JSON.stringify(config.data);
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.errCode == 2) {
            router.push({
                path: "/login",
                querry: { redirect: router.currentRoute.fullPath }   //从哪个页面跳转
            })
        }
        return response;
    },
    error => {
        return Promise.reject(error)
    }
);

export default {

    /**
     * 封装get方法
     * @param url
     * @param data
     * @returns {Promise}
     */
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: params
            }).then(response => {
                resolve(response.data);
            })
                .catch(err => {
                    reject(err)
                })
        })
    },

    /**
    * 封装post请求
    * @param url
    * @param data
    * @returns {Promise}
    */
    post(url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, data)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    reject(err)
                })
        })
    },

    /**
    * 封装patch请求
    * @param url
    * @param data
    * @returns {Promise}
    */
    patch(url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.patch(url, data)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    reject(err)
                })
        })
    },

    /**
     * 封装put请求
     * @param url
     * @param data
     * @returns {Promise}
     */
    put(url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.put(url, data)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    reject(err)
                })
        })
    },

    /**
     * 封装put请求
     * @param url
     * @param data
     * @returns {Promise}
     */
    delete(url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.delete(url, data)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    reject(err)
                })
        })
    }
};