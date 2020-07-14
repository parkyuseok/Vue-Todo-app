import Vue from 'vue'
import App from './App'
import router from './router' // './router/index.js' index.js는 생략가능하다.

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
