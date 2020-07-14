<template>
    <section class="home">
        <div>
            <h1>
                YUSEOK's Home page!
            </h1>
            <h2 @click="toAbout">
                About
            </h2>
            <!-- script의 코드에 적는것이 번거롭다면 this를 빼고 작성하면 된다. -->
            <h2 @click="$router.push('/todos')">
                Todo App
            </h2>
        </div>
    </section>
</template>

<script>
export default {
    methods: {
        toAbout () {
            // 특정한 페이지로 밀어서 보내겠다.
            this.$router.push('/about')
        }
    }
}
</script>