<template>
    <!-- template 태그 내부에는 자식요소 1개만 들어갈 수 있어서 div를 만들어서 넣어준다. -->
    <div class="todo-app">

        <div class="todo-app__actions">
            <div class="filters">
                <router-link 
                    to="/todos/all"
                    tag="button"> <!-- /todos/all 대신에 all만 적어도 동일한 효과 -->
                        모든 항목 ({{ total }})
                </router-link>
                <router-link  
                    to="/todos/active"
                    tag="button">
                        해야 할 항목 ({{ activeCount }})
                </router-link >
                <router-link  
                    to="/todos/completed"
                    tag="button">
                    완료된 항목 ({{ completedCount }})
                </router-link >
            </div>

            <div class="actions clearfix">
                <div class="float--left">
                    <label>
                        <input 
                            v-model="allDone"
                            type="checkbox"
                        />
                        <span class="icon">
                            <i class="material-icons">done_all</i>
                        </span>
                    </label>
                </div>
                <div class="float--right clearfix">
                    <button 
                        class="btn float--left"
                        @click="scrollToTop"
                    >
                        <i class="material-icons">expand_less</i>
                    </button>
                    <button 
                        class="btn float--left"
                        @click="scrollToBottom"
                    >
                        <i class="material-icons">expand_more</i>
                    </button>
                    <button 
                        class="btn btn--danger float--left"
                        @click="clearCompleted">
                            <i class="material-icons">delete_sweep</i>
                    </button>
                </div>
            </div>

        </div>

        <div class="todo-app__list">
            <!-- :todo="todo"는 todo라는 props를 통해 data를 전달하고 있다. -->
            <todo-item 
                v-for="todo in filteredTodos"
                :key="todo.id"
                :todo="todo"
                @update-todo="updateTodo"
                @delete-todo="deleteTodo"
            />
        </div>

        <todo-creator 
            class="todo-app__creator"
            @create-todo="createTodo" />
    </div>
</template>

<script>
// 일반적으로 node_modules에서 가져오는 것은 상단에 배치하는 것이 좋다.(상대 경로랑 구분)
import lowdb from 'lowdb' // https://github.com/typicode/lowdb
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string' // https://github.com/sindresorhus/crypto-random-string
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import scrollTo from 'scroll-to'
// webpack.config.js에서 alias를 통해 절대경로로 작성
import TodoCreator from '~/components/TodoCreator' //TodoCreator라는 이름으로 가져온다.
import TodoItem from '~/components/TodoItem'

export default {
    // 외부에서 가져온 컴포넌트를 연결하는 옵션
    components: {
        // 가져온 컴포넌트를 연결해준다.
        TodoCreator,
        TodoItem
    },
    // 계산된 데이터
    computed: {
        filteredTodos () {
            switch (this.$route.params.id) {
                case 'all':
                default: //case와 default 일 경우.
                    return this.todos
                case 'active': // 해야 할 항목
                    return this.todos.filter(todo => !todo.done)
                case 'completed': // 완료된 항목
                    return this.todos.filter(todo => todo.done)
            }
        },
        allDone: {
            get () {
                return this.total === this.completedCount && this.total > 0
            },
            set (checked) {
                this.completeAll(checked)
            }
        }
    },
    // TodoApp.vue라는 컴포넌트가 생성되고 나서 직후에 바로 호출된다.
    created () {
        this.initDB()
    },
    methods: {
        updateTodo (todo, value) {
            console.log("Test")
            this.db
                .get('todos')
                .find({ id: todo.id })
                .assign(value)
                .write()
            
            const foundTodo = _find(this.todos, { id: todo.id })
            _assign(foundTodo, value)
        },
        deleteTodo (todo) {
            this.db
                .get('todos')
                .remove({ id: todo.id })
                .write()
            const foundIndex = _findIndex(this.todos, { id: todo.id })
            this.$delete(this.todos, foundIndex)
        },
        completeAll (checked) {
            // DB
            const newTodos = this.db
                .get('todos')
                .forEach(todo => {
                    todo.done = checked 
                })
                .write()

            // Local todos
            // this.todos.forEach(todo => {
            //     todo.done = checked
            // })
            this.todos = _cloneDeep(newTodos) //지금 같은 경우에는 참조관계 때문에 cloneDeep을 쓴다.
        },
        clearCompleted () {
            // this.todos.forEach(todo => {
            //     if (todo.done) {
            //         this.deleteTodo(todo)
            //     }
            // })
            // 위에는 앞에서 부터 삭제, 삭제시 문제 발생함 아래는 뒤에서 부터 삭제하는 native code
            // this.todos
            //     .reduce((list, todo, index) => {
            //         if (todo.done) {
            //             list.push(index)
            //         }
            //         return list
            //     }, [])
            //     .reverse()
            //     .forEach(index => {
            //         this.deleteTodo(this.todos[index])
            //     })

            _forEachRight(this.todos, todo => {
                if (todo.done) {
                    this.deleteTodo(todo)
                }
            })
        },
        scrollToTop () {
            scrollTo(0, 0, {
                ease: 'linear',
            })
        },
        scrollToBottom () {
            scrollTo(0, document.body.scrollHeight, {
                ease: 'linear',
            })
        }
    }
}
</script>

<style lang="scss">
    // webpack에서 설정한 alias를 통해 절대경로로 작성해줌.
    @import "scss/style"; //SCSS partials라는 개념에 의해 _(언더바) 사라짐

    .filters button.router-link-active {
        background: royalblue;
        color: white;
    }
</style>