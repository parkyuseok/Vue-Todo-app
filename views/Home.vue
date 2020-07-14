<template>
    <section class="home">
        <div>
            <h1>
                YUSEOK's Home page!
            </h1>
            <!-- script의 코드에 적는것이 번거롭다면 this를 빼고 작성하면 된다. -->
            <h2 @click="$router.push('/about')">
                About
            </h2>
            <!-- 네비게이션을 위해 router-link 컴포넌트를 사용합니다. -->
            <!-- 구체적인 속성은 `to` prop을 이용합니다. -->
            <!-- 기본적으로 `<router-link>`는 `<a>` 태그로 렌더링됩니다.-->
            <router-link 
                to="/todos" 
                tag="h2">
                    Todo App
            </router-link>
        </div>
    </section>
</template>

// <script>
// export default {
//     methods: {
//         toAbout () {
//             // 특정한 페이지로 밀어서 보내겠다.
//             this.$router.push('/about')
//         }
//     }
// }
// </script>