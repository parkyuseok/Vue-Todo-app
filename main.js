import Vue from 'vue'
import App from './App'
import router from './router' // './router/index.js' index.js는 생략가능하다.
import store from './store' // index.js는 생략 가능

new Vue({
  el: '#app',
  // Vue에 연결
  router,
  store,
  render: h => h(App) // https://css-tricks.com/what-does-the-h-stand-for-in-vues-render-method/
})

// webpack.config.js에서 entry를 main.js로 설정하였고 plugins에서 index.html을 설정해줌
