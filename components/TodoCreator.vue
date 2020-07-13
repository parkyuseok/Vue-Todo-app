<template>
    <div>
        <button @click="createTodo">추가</button>
        <!--[참고] 
            Vue를 작성하는 Code convention 
            1.바인딩된 속성 
            2.일반속성 
            3.이벤트 순으로 작성한다.-->
        <input 
            :value="title"
            :placeholder="placeholder"
            type="text"
            @input="title = $event.target.value"
            @keypress.enter="createTodo"
        /> 
    </div>
</template>

<script>
export default {
    data () {
        return {
            title: '',
            placeholder: '할 일을 추가하세요!'
        }
    },
    methods: {
        createTodo () {
            // this.title = '' 빈 문자열이면 false로 나오고 좌우 공백을 제거한 title이 빈문자열이여도 false
            const validatedTitle = this.title && this.title.trim()
            if (!validatedTitle) {
                alert('유효하지 않은 제목입니다!')
                this.title = this.title.trim()
                return
            }

            this.$emit('create-todo', this.title) // this.$emit('eventName', 특정 데이터)
            this.title = '' //초기화하는 코드
        }
    }
}
</script>