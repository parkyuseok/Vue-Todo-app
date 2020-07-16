import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'

Vue.use(VueRouter)

const routes = [
  // config(구성)
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
    redirect: '/todos/all',
    component: TodoApp,
    children: [
      {
        name: 'todos-filter',
        path: ':id' // id 라는 :(이름의 parameter를 받을 것이다.)
      }
    ]
  }
]

export default new VueRouter({
  routes // `routes: routes`의 줄임
})
