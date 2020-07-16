<template>
    <div>
        <button @click="createTodo">
            <i class="material-icons">add</i>
        </button>
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

      // this.$emit('create-todo', this.title), action에 접글할 때 스토어에 디스패치, mutation에 접근할 때 스토어에 있는 커밋
      this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = '' // 초기화하는 코드

      // $nextTick 화면이 렌더링 되는 것을 기다리고 처리한다.
      this.$nextTick(() => {
        // window.scrollTo(x, y)
        window.scrollTo(0, document.body.scrollHeight)
      })
    }
  }
}
</script>
