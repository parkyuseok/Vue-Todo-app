import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'
Vue.use(VueRouter)

const routes = [
    //config(구성)
    {
        path: '/', // /가 하는 역할은 "이 페이지의 루트 페이지이다(최상위 페이지)"
        component: Home 
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/todos',
        component: TodoApp
    }
]

export default new VueRouter({
    routes
})