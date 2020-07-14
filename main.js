import Vue from 'vue'
import App from './App'
import router from './router' // './router/index.js' index.js는 생략가능하다.

new Vue({
  el: '#app',
  router,
  render: h => h(App) // https://goodteacher.tistory.com/85
})

// webpack.config.js에서 entry를 main.js로 설정하였고 plugins에서 index.html을 설정해줌