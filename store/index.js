import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    // https://vuex.vuejs.org/kr/guide/strict.html
    strict: process.env.NODE_ENV !== 'production'
})