<template>
    <div 
        :class="{ done: done }"
        class="todo-item"
    >

        <div 
            v-if="isEditMode"
            class="item__inner item--edit"
        >
            <input 
                ref="titleInput"
                :value="editedTitle"
                type="text"
                @input="editedTitle - $event.target.value"
                @keypress.enter="editedTodo"
                @keypress.esc="offEditMode"
            >
            <div class="item__action">
                <button 
                    class="btn btn--primary"
                    key="complete"
                    @click="editedTodo">
                    <i class="material-icons">done</i>
                    </button>
                <button 
                    class="btn"
                    key="cancel"
                    @click="offEditMode">
                    <i class="material-icons">clear</i>
                    </button>
            </div>
        </div>
        <div 
            v-else
            class="item__inner item--normal"
        >
            <!--todo item이 완료된 일인지 해야할 일인지 체크할 체크박스 
            v-model을 통해서 done이라는 computed data 부분을 바인드 시켜주고
            done이 true면 check가 되어있는 상태 false면 체크 X -->
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
                <div class="item__title">
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
                    @click="onEditMode">
                    <i class="material-icons">edit</i>
                    </button>
                <button 
                    class="btn btn--danger"
                    key="delete"
                    @click="deleteTodo">
                    <i class="material-icons">delete</i>
                    </button>
            </div>
        </div>

    </div>
</template>

<script>
import dayjs from 'dayjs' //moment.js 경량화 버전(다른 라이브러리 이지만 같은 문법)

export default {
    props: {
        // todo라는 이름으로 받아 쓸건데 type이 배열안에 있는 Object 형태로 각각의 todo 아이템들이 들어올 것이다.라고 명시해준 것
        todo: Object
    },
    data () {
        return {
            isEditMode: false,
            //title을 직접 바꾸면 취소하고 싶어도 원래 값을 뭔지 모르므로 돌아갈 수 없다.
            editedTitle: ''
        }
    },
    computed: {
        // done이라는 computed data를 객체 형식으로 작성.
        done: {
            get () {
                return this.todo.done
            },
            // done이라는 computed data가 변경되면 set()이라는 메소드가 반응하는데
            // Setter는 변경된 값을 매개변수로 받아서 쓸 수 있다.
            set (done) {
                //computed data에 직접적으로 값을 할당할 때
                //할당받은 값을 어떻게 처리할 것인가 이 부분에 로직으로 작성할 수 있다.
                this.updateTodo({
                    done //done: done, done에다가 전달받은 done을 update 시킨다.
                })
            }
        },
        date () {
            //https://momentjs.com/docs/#/displaying/
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
        editedTodo () {
            // 수정전 title !== 수정후 title이 같지 않아야만
            if (this.todo.title !== this.editedTitle){
                this.updateTodo({
                    title: this.editedTitle,
                    updatedAt: new Date()
                })
            }

            this.offEditMode()
        },
        onEditMode () {
            this.isEditMode = true
            this.editedTitle = this.todo.title
            // 1. isEditMode를 true로 해서 화면을 바꾸어 줄건데 
            // 그것이 갱신되고 나서 렌더링이 끝나면
            this.$nextTick(() => { //$nextTick는 화면이 렌더링이 되었다는 것을 보장시킬 때 사용
                this.$refs.titleInput.focus() //2.그 때 titleInput을 찾아서 포커싱 하겠다.
            })
        },
        offEditMode () {
            this.isEditMode = false
        },
        updateTodo (value) {
            // ('event-Name', 
            // 어떤 todo가 업데이트 되는지 알아야 되기 때문에 현재 객체 this.todo를 적어주고, 
            // 어떠한 값이 업데이트 될 것인지)
            this.$emit('update-todo', this.todo, value)
        },
        deleteTodo () {
            this.$emit('delete-todo', this.todo)
        }
    }
}
</script>