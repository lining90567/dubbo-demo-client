import * as types from './mutation-types'

export default {
    setLoading({commit}, data) {
        commit(types.SET_LOADING, data)
    },
    setBreadcurmbItems({commit}, data) {
        commit(types.SET_BREADCRUMB_ITEMS, data)
    }
}