<template>
  <div>
    <router-link
      to="/"
      class="to-home">
      <i class="material-icons">home</i>
    </router-link>

    <!-- 라우트 아울렛 -->
    <!-- 현재 라우트에 맞는 컴포넌트가 렌더링됩니다. -->
    <router-view />
  </div>
</template>

<script>
export default {
  created () {
    // router라는 것은 프로젝트에 연결되어 있는 router에 관한 정보, 제어할 수 있는 method가 들어있는 객체이다.
    console.log('Router:', this.$router)
    // route는 현재 접속해 있는 페이지에 해당하는 주소(URL)에 대한 정보가 들어있는 객체이다.
    console.log('Route', this.$route)
  }
}
</script>

<style lang="scss">
  .to-home.router-link-exact-active {
    display: none;
  }
</style>
