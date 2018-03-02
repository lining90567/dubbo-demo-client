import * as types from './mutation-types'

const mutations = {
    [types.SET_LOADING]: (state, data) => {
        state.showLoading = data
    },
    [types.SET_BREADCRUMB_ITEMS]: (state, data) => {
        state.breadcrumbItems = data
    }
}

export default mutations