<template>
    <div
        :class="{ done: done }"
        class="todo-item"
    >
        <!-- EDIT -->
        <div
            v-if="isEditMode"
            class="item__inner item--edit"
        >
            <input
                ref="titleInput"
                :value="editedTitle"
                type="text"
                @input="editedTitle - $event.target.value"
                @keydown.enter="editedTodo"
                @keydown.esc="offEditMode"
            >
            <div class="item__action">
                <button
                    class="btn btn--primary"
                    key="complete"
                    @click="editedTodo"
                >
                  <i class="material-icons">done</i>
                </button>
                <button
                    class="btn"
                    key="cancel"
                    @click="offEditMode"
                >
                  <i class="material-icons">clear</i>
                </button>
            </div>
        </div>

        <!-- NORMAL -->
        <div
            v-else
            class="item__inner item--normal"
        >
            <label>
                <input
                    v-model="done"
                    type="checkbox"
                />
                <span class="icon">
                    <i class="material-icons">check</i>
                </span>
            </label>
            <div class="item__title-wrap">
                <div 
                  class="item__title"
                  @dblclick="onEditMode">
                    {{ todo.title}}
                </div>
                <div class="item__date">
                    {{ date }}
                </div>
            </div>
            <div class="item__actions">
                <button
                    class="btn"
                    key="update"
                    @click="onEditMode"
                >
                  <i class="material-icons">edit</i>
                </button>
                <button
                    class="btn btn--danger"
                    key="delete"
                    @click="deleteTodo"
                >
                  <i class="material-icons">delete</i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs' // moment.js 경량화 버전(다른 라이브러리 이지만 같은 문법)

export default {
  name: 'TodoItem',
  props: {
    // todo라는 이름으로 받아 쓸건데 type이 배열안에 있는 Object 형태로 각각의 todo 아이템들이 들어올 것이다.라고 명시해준 것
    todo: Object
  },
  data () {
    return {
      isEditMode: false,
      // title을 직접 바꾸면 취소하고 싶어도 원래 값을 뭔지 모르므로 돌아갈 수 없다.
      editedTitle: this.todo.title
    }
  },
  computed: {
    done: {
      get () {
        return this.todo.done
      },
      // done이라는 computed data가 변경되면 set()이라는 메소드가 반응하는데
      // Setter는 변경된 값을 매개변수로 받아서 쓸 수 있다.
      set (done) {
        this.updateTodo({
          done
        })
      }
    },
    date () {
      const date = dayjs(this.todo.createdAt)
      const isSame = date.isSame(this.todo.updatedAt)
      if (isSame) {
        return date.format('YYYY년 MM월 DD일')
      } else {
        return `${date.format('YYYY년 MM월 DD일')} (edited)`
      }
    }
  },
  methods: {
    onEditMode () {
      this.editedTitle = this.todo.title
      this.isEditMode = true
      // Vue.js가 데이터 변경 후 DOM 업데이트를 마칠 때까지 기다림.
      this.$nextTick(() => { // $nextTick는 화면이 렌더링이 되었다는 것을 보장시킬 때 사용
        this.$refs.titleInput.focus() // 2.그 때 titleInput을 찾아서 포커싱 하겠다.
      })
    },
    offEditMode () {
      this.isEditMode = false
    },
    editedTodo () {
      // 수정전 title !== 수정후, 수정한 내용이 있는 경우만 저장!
      if (this.todo.title !== this.editedTitle) {
        this.updateTodo({
          title: this.editedTitle,
          updatedAt: new Date()
        })
      }
      // 수정 모드 종료.
      this.offEditMode()
    },
    updateTodo (value) {
      // ('event-Name',
      // 어떤 todo가 업데이트 되는지 알아야 되기 때문에 현재 객체 this.todo를 적어주고,
      // 어떠한 값이 업데이트 될 것인지)
      // this.$emit('update-todo', this.todo, value)
      this.$store.dispatch('todoApp/updateTodo', {
        todo: this.todo,
        value
      })
    },
    deleteTodo () {
      // this.$emit('delete-todo', this.todo)
      this.$store.dispatch('todoApp/deleteTodo', this.todo)
    }
  }
}
</script>
