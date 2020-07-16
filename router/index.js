// 0. 모듈 시스템 (예: vue-cli)을 이용하고 있다면, Vue와 Vue 라우터를 import 하세요
// 그리고 `Vue.use(VueRouter)`를 호출하세요
import Vue from 'vue'
import VueRouter from 'vue-router'

// 1. 라우트 컴포넌트를 정의하세요.
// 다른 파일로부터 가져올 수 있습니다.
import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'

Vue.use(VueRouter)

// 2. 라우트를 정의하세요.
// Each route should map to a component. The "component" can
// 각 라우트는 반드시 컴포넌트와 매핑되어야 합니다.
// "component"는 `Vue.extend()`를 통해 만들어진
// 실제 컴포넌트 생성자이거나 컴포넌트 옵션 객체입니다.
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

// 3. `routes` 옵션과 함께 router 인스턴스를 만드세요.
// 추가 옵션을 여기서 전달해야합니다.
export default new VueRouter({
  routes // `routes: routes`의 줄임
})
